import dotenv from 'dotenv';
import {resolve} from 'path';
const thePath=resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config({path:thePath});
export default {
    port: process.env.PORT || 3000,
    uri: process.env.URI,
    ENC_KEY:process.env.ENC_KEY
    ,ENC_ALGO:process.env.ENC_ALGO,
    SALT_ROUNDS:Number(process.env.SALT_ROUNDS),
    ENC_IV_LENGTH: Number(process.env.ENC_IV_LENGTH),ACCESS_SECRET_USER: process.env.ACCESS_SECRET_USER,
    ACCESS_SECRET_ADMIN: process.env.ACCESS_SECRET_ADMIN,

    REFRESH_SECRET_USER: process.env.REFRESH_SECRET_USER,
    REFRESH_SECRET_ADMIN: process.env.REFRESH_SECRET_ADMIN,

    ACCESS_EXPIRES_IN: Number(process.env.ACCESS_EXPIRES_IN),
    REFRESH_EXPIRES_IN: Number(process.env.REFRESH_EXPIRES_IN),

    JWT_ISSUER: process.env.JWT_ISSUER,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
}
