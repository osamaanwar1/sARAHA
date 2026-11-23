import { OAuth2Client } from "google-auth-library";
import configService from "../../config/config.service.js";
import *as exception from './exception.js'

const client = new OAuth2Client(configService.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: configService.GOOGLE_CLIENT_ID
    });
console.log(idToken);
    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
        exception.ConflictException("Invalid Google account");
    }

    return payload;
};