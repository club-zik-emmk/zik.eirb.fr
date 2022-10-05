import { Request, Response } from "express";
import { User } from "../models";
import { error, success } from "../utils";

const userController = {
    listAllUsers,
    getUserById,
    createOrUpdateUser,
    deleteUserById
};


function listAllUsers(req: Request, res: Response) {
    return User.findAll().then((users) => {
        return success(res, "Liste des utilisateurs", "USER/LIST", users);
    }).catch((e) => {
        console.log(e);
        return error(res, "Erreur lors de la récupération de la liste des utilisateurs", "USER/LIST_FAILED");
    });
}


function getUserById(req: Request, res: Response) {
    return User.findByPk(req.params.id).then((user) => {
        if (user) {
            return success(res, "Détails de l'utilisateur", "USER/DETAILS", user);
        } else {
            return error(res, "Utilisateur introuvable !", "USER/NOT_FOUND", 404);
        }
    }).catch((e) => {
        console.log(e);
        return error(res, "Erreur lors de la récupération de l'utilisateur", "USER/GET_FAILED");
    });
}


async function createOrUpdateUser(req: Request, res: Response) {
    // Check that if there is an id, it corresponds to an existing group
    if (req.params.id) {
        if (!(await User.findByPk(req.params.id)))
            return error(res, "Utilisateur introuvable !", "USER/NOT_FOUND", 404);
        else if (req.body.id)
            return error(res, "Le champ id ne peut pas être modifié !", "USER/ID_NOT_MODIFIABLE");
    } else {
        if (!req.body.id || req.body.id.length > 100)
            return error(res, "L'id de l'utilisateur doit être un identifiant unique de 100 caractères maximum", "VALIDATION/ID_INVALID");
        else if (await User.findByPk(req.body.id))
            return error(res, "Cet id est déjà utilisé !", "USER/ID_ALREADY_USED");
    }

    // Check that firstName is a string and not too long
    if (!req.body.firstName || req.body.firstName.length > 100)
        return error(res, "Le prénom doit être une chaîne de caractères de maximum 100 caractères !", "VALIDATION/FIRSTNAME_INVALID");

    // Check that lastName is a string and not too long
    if (!req.body.lastName || req.body.lastName.length > 100)
        return error(res, "Le nom doit être une chaîne de caractères de maximum 100 caractères !", "VALIDATION/LASTNAME_INVALID");
    
    // Check that displayName is a string and not too long
    if (req.body.displayName && req.body.displayName.length > 200)
        return error(res, "Le nom d'affichage doit être une chaîne de caractères de maximum 200 caractères !", "VALIDATION/DISPLAYNAME_INVALID");
    
    // Check that admin is a boolean
    if (typeof req.body.admin !== "boolean")
        return error(res, "Le champ admin doit être un booléen !", "VALIDATION/ADMIN_INVALID");
    
    // Check that member is a boolean
    if (typeof req.body.member !== "boolean")
        return error(res, "Le champ member doit être un booléen !", "VALIDATION/MEMBER_INVALID");

    // Check that group is a string and not too long
    if (!req.body.group || req.body.group.length > 100)
        return error(res, "Le groupe doit être une chaîne de caractères de maximum 100 caractères !", "VALIDATION/GROUP_INVALID");
    
    // Check that year is a number
    if (!req.body.year || typeof req.body.year !== "number")
        return error(res, "L'année doit être un nombre !", "VALIDATION/YEAR_INVALID");


    // Create local user object from request body

    const user = {
        id: req.params.id || req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        displayName: req.body.displayName,
        admin: req.body.admin,
        member: req.body.member,
        group: req.body.group,
        year: req.body.year
    };

    if (req.params.id) {
        return User.update(user, { where: { id: req.params.id } })
            .then(() => {
                return success(res, "Utilisateur modifié avec succès !", "USER/UPDATED", null);
            }).catch((e) => {
                console.log(e);
                return error(res, "Erreur lors de modification de l'utilisateur!", "USER/UPDATE_FAILED");
            });
    } else {
        return User.create(user)
            .then((user) => {
                return success(res, "Utilisateur créé avec succès !", "USER/CREATED", user);
            }).catch((e) => {
                console.log(e);
                return error(res, "Erreur lors de la création de l'utilisateur!", "USER/CREATE_FAILED");
            });
    }
}


function deleteUserById(req: Request, res: Response) {
    const userId = req.params.id;

    return User.destroy({ where: { id: userId } })
        .then((affectedRows) => {
            if (affectedRows) {
                return success(res, "Utilisateur supprimé avec succès !", "USER/DELETED", userId);
            } else {
                return error(res, "Utilisateur introuvable !", "USER/NOT_FOUND", 404);
            }
        })
        .catch((e) => {
            console.log(e);
            return error(res, "Erreur lors de la suppression de l'utilisateur!", "USER/DELETE_FAILED");
        });
}


export default userController;