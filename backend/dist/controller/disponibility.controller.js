"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../utils");
const userController = {
    listAllDisponibilities,
    getDisponibilityById,
    createOrUpdateDisponibility,
    deleteDisponibilityById
};
function listAllDisponibilities(req, res) {
    return models_1.Disponibility.findAll().then((disponibilities) => {
        return (0, utils_1.success)(res, "Liste des disponibilités", "DISPONIBILITY/LIST", disponibilities);
    }).catch((e) => {
        console.log(e);
        return (0, utils_1.error)(res, "Erreur lors de la récupération de la liste des disponibilités", "DISPONIBILITY/LIST_FAILED");
    });
}
function getDisponibilityById(req, res) {
    return models_1.Disponibility.findByPk(req.params.id).then((disponibility) => {
        if (disponibility) {
            return (0, utils_1.success)(res, "Détails de la disponibilité", "DISPONIBILITY/DETAILS", disponibility);
        }
        else {
            return (0, utils_1.error)(res, "Disponibilité introuvable !", "DISPONIBILITY/NOT_FOUND", 404);
        }
    }).catch((e) => {
        console.log(e);
        return (0, utils_1.error)(res, "Erreur lors de la récupération de la disponibilité", "DISPONIBILITY/GET_FAILED");
    });
}
async function createOrUpdateDisponibility(req, res) {
    // check that day is a number and between 1 and 6
    if (req.body.day && typeof req.body.day === "number" && req.body.day < 1 && req.body.day > 6) {
        return (0, utils_1.error)(res, "Le jour doit être un nombre entre 1 et 6", "VALIDATION/DAY_INVALID");
    }
    // check that openningTime is a number
    if (req.body.openningTime && typeof req.body.openningTime !== "number") {
        return (0, utils_1.error)(res, "L'heure d'ouverture doit être un nombre", "VALIDATION/OPENNING_TIME_INVALID");
    }
    // check that closingTime is a number
    if (req.body.closingTime && typeof req.body.closingTime !== "number") {
        return (0, utils_1.error)(res, "L'heure de fermeture doit être un nombre", "VALIDATION/CLOSING_TIME_INVALID");
    }
    // check that startDate is of type Date of format "YYYY-MM-DD"
    if (req.body.startDate && typeof req.body.startDate === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(req.body.startDate)) {
        return (0, utils_1.error)(res, "La date de début doit être au format YYYY-MM-DD", "VALIDATION/START_DATE_INVALID");
    }
    // check that endDate is of type Date of format "YYYY-MM-DD"
    if (req.body.endDate && typeof req.body.endDate === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(req.body.endDate)) {
        return (0, utils_1.error)(res, "La date de fin doit être au format YYYY-MM-DD", "VALIDATION/END_DATE_INVALID");
    }
    // check that allowNoise is a boolean
    if (req.body.allowNoise && typeof req.body.allowNoise !== "boolean") {
        return (0, utils_1.error)(res, "Le champ allowNoise doit être un booléen", "VALIDATION/ALLOW_NOISE_INVALID");
    }
    // check that priority is a number
    if (req.body.priority && typeof req.body.priority !== "number") {
        return (0, utils_1.error)(res, "La priorité doit être un nombre", "VALIDATION/PRIORITY_INVALID");
    }
    // Create local disponibility object from request body
    const disponibility = {
        day: req.body.day,
        openningTime: req.body.openningTime,
        closingTime: req.body.closingTime,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        allowNoise: req.body.allowNoise,
        priority: req.body.priority
    };
    if (req.params.id) {
        return models_1.Disponibility.update(disponibility, { where: { id: req.params.id } })
            .then(() => {
            return (0, utils_1.success)(res, "Disponibilité modifiée avec succès !", "DISPONIBILITY/UPDATED", null);
        }).catch((e) => {
            console.log(e);
            return (0, utils_1.error)(res, "Erreur lors de modification de la disponibilité!", "DISPONIBILITY/UPDATE_FAILED");
        });
    }
    else {
        return models_1.Disponibility.create(disponibility)
            .then((disponibility) => {
            return (0, utils_1.success)(res, "Disponibilité créée avec succès !", "DISPONIBILITY/CREATED", disponibility);
        }).catch((e) => {
            console.log(e);
            return (0, utils_1.error)(res, "Erreur lors de la création de la disponibilité!", "DISPONIBILITY/CREATE_FAILED");
        });
    }
}
function deleteDisponibilityById(req, res) {
    const dispoId = req.params.id;
    return models_1.Disponibility.destroy({ where: { id: dispoId } })
        .then((affectedRows) => {
        if (affectedRows) {
            return (0, utils_1.success)(res, "Disponibilité supprimé avec succès !", "DISPONIBILITY/DELETED", dispoId);
        }
        else {
            return (0, utils_1.error)(res, "Disponibilité introuvable !", "DISPONIBILITY/NOT_FOUND", 404);
        }
    })
        .catch((e) => {
        console.log(e);
        return (0, utils_1.error)(res, "Erreur lors de la suppression de l'disponibilité!", "DISPONIBILITY/DELETE_FAILED");
    });
}
exports.default = userController;
