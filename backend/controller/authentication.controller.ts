import {Request, Response} from "express";
import {User} from "../models";
import axios from "axios";

/**
 * Validates a CAS ticket and returns the username of the user who owns the ticket.
 *
 * @param casServerUrl {string} The URL of the CAS server.
 * @param serviceUrl {string} The URL of the reflection service.
 * @param ticket {string} The ticket to validate.
 *
 * @returns {Promise<string | null>} The username of the user who owns the ticket or null if the ticket is invalid.
 */
async function validateCasTicket(casServerUrl: string, serviceUrl: string, ticket: string): Promise<string | null> {
    const response = await axios.get(`${casServerUrl}/serviceValidate?service=${encodeURIComponent(serviceUrl)}&ticket=${ticket}`);
    const body = await response.data;

    return (body.split('<cas:user>')[1] || "").split('</cas:user>')[0] || null;
}



/**
 * Authentication route handler.
 * Authenticates the user and stores the user in the session.
 *
 * @param request {Request} The request object.
 * @param response {Response} The response object.
 */
async function authenticate(request: Request, response: Response): Promise<void> {
    // Handle the case where the user sends a wrong request
    if (!request.query.ticket || !request.query.token) {
        response.status(400).json({
            success: false,
            error: {
                message: 'Missing ticket or token'
            }
        });
        return;
    }

    // Extract the ticket and the token from the request
    const ticket: string = `${request.query.ticket}`;
    const token: string = `${request.query.token}`;
    const [serviceEncoded, domain] = token.split('@');

    // Check that that isn't some nasty hacker
    if (domain !== 'bordeaux-inp.fr') {
        response.status(400).json({
            success: false,
            error: {
                message: 'Invalid CAS server'
            }
        });
        return;
    }

    // Decode the service
    const casServiceUrl = `https://aboin.vvv.enseirb-matmeca.fr/casAuth/?token=${serviceEncoded}@${domain}`;
    const casServerUrl = `https://cas.${domain}`;

    // Validate the ticket
    const username = await validateCasTicket(
        casServerUrl,
        casServiceUrl,
        ticket
    );

    // If the ticket is invalid, return an error
    if (!username) {
        response.status(400).json({
            success: false,
            error: {
                message: 'Invalid CAS ticket'
            }
        });
        return;
    }

    // Get the user from the database
    
    let user = await User.findOne({
        where: {
            id: username
        }
    });

    // If the user hasn't been found
    if (!user) {
        user = await User.create({
            id: username,
            admin: false,
            member: false
        });
    }

    // Store the user in the session
    // @ts-ignore
    request.session.user = user;

    response.status(200).json({
        success: true,
        user: user
    });
}

async function me(request: Request, response: Response) {
    // @ts-ignore
    const user = request.session.user;

    if (!user) {
        response.status(401).json({
            success: false,
            error: {
                message: 'User not authenticated'
            }
        });
        return;
    }

    response.status(200).json({
        success: true,
        user: user
    });
}

/**
 * Logout route handler.
 * Logs the user out of the session.
 *
 * @param request {Request} The request object.
 * @param response {Response} The response object.
 */
async function logout(request: Request, response: Response): Promise<void> {
    // The user cannot log out if he is not logged in
    // @ts-ignore
    if (!request.session.user) {
        response.status(401)
            .json({
                success: false,
                error: {
                    message: 'User not authenticated'
                }
            });
        return;
    }

    // Destroy the session
    request.session.destroy(error => {
        // Handle the possible errors
        if (error) {
            console.error(error);
            response.status(500).json({
                success: false,
                error: {
                    message: 'Error while logging out'
                }
            });
            return;
        }

        // Inform the client that the user has been logged out
        response.status(200).json({
            success: true,
            message: 'User logged out'
        });
    });
}

export {
    authenticate,
    logout,
    me
};
