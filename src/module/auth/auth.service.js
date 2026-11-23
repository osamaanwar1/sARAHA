
import configService from "../../config/config.service.js";

import ur from "../../database/repo/user.repo.js";

import {
    verifyGoogleToken
} from "../../common/utils/google.js";

import {
    encrypt
} from "../../common/security/encription.js";

import {
    generateHash,
    compareHash
} from "../../common/security/hash.js";

import {
    createLoginCredentials,
    generateToken
} from "../../common/security/token.js";

import * as exception from "../../common/utils/exception.js";

import * as theRole from "../../common/enum/RoleEnum.js";

import { tokenType } from "../../common/enum/tokentype.js";

import { providerEnum } from "../../common/enum/ProviderEnum.js";
import {role} from "../../common/enum/RoleEnum.js";
const USER = ur.repo;



export async function signup(data) {

    const {
        email,
        password,
        phone,
        role: userRole,
        ...remain
    } = data;

    const emailExists = await USER.findOne({
        filter: { email }
    });

    if (emailExists) {
        exception.ConflictException("Email already exists");
    }
    const user = await USER.create({
        data: {
            ...remain,
            email,
            password: await generateHash({
                plainText: password
            }),
            phone: phone ? encrypt(phone) : undefined,
            role: theRole.role.USER,
            provider: ProviderEnum.system
        }
    });

    // حذف كلمة المرور من النتيجة
    const { password: removedPassword, ...safeData } = user.toObject();

    return safeData;
}


export async function login(data) {

    const { email, password } = data;

    const user = await USER.findOne({
        filter: { email }
    });

    if (
        !user ||
        !user.password ||
        !(await compareHash({
            plainText: password,
            hashed: user.password
        }))
    ) {
        exception.UnauthorizedException("Invalid email or password");
    }

    return createLoginCredentials(user);
}


export function refreshTokenf(user, payload) {

    const accessIat = payload.iat * 1000;

    const accessExpIn =
        Number(configService.ACCESS_EXPIRES_IN) * 1000;

    const accessExpAt = accessIat + accessExpIn;

    if (Date.now() < accessExpAt) {
        exception.ConflictException("Access token still valid");
    }

    const tokenPayload = {
        sub: String(user._id)
    };

    const accessToken = generateToken({
        payload: tokenPayload,
        role: user.role,
        type: tokenType.ACCESS
    });

    const refreshToken = generateToken({
        payload: tokenPayload,
        role: user.role,
        type: tokenType.REFRESH
    });

    return {
        accessToken,
        refreshToken
    };
}

export async function loginWithTheGoogle(data) {

const  idToken= data.idToken
    console.log("2- ID Token exists:", !!idToken);
    console.log("3- Google Client ID exists:", !!process.env.GOOGLE_CLIENT_ID);
    const payload = await verifyGoogleToken(idToken)

    console.log("4- Google payload verified:", !!payload);
    console.log("5- Email:", payload?.email);

    if(!payload||!payload.email_verified||!payload.email){
        exception.NotFoundException('something missing')
    }
    let user = await USER.findOne({filter:{email:payload.email,provider:providerEnum.google}});
    if(user){
        return createLoginCredentials(user);
    }
    user =await USER.findOne({filter:{email:payload.email,provider:providerEnum.systm}});
    if (user) {
        user = await USER.findOneAndUpdate({
            filter: { _id: user._id },
            updates: {
                provider: providerEnum.google,
                image: payload.picture
            },
            options: { new: true }
        });

        return createLoginCredentials(user);
    }


        const firstName =
            payload.given_name ||
            payload.name?.split(" ")[0] ||
            "Google";

        const lastName =
            payload.family_name ||
            payload.name?.split(" ").slice(1).join(" ") ||
            undefined;
    user = await USER.create({
        data: {
            firstName,
            lastName,
            email: payload.email,
            image: payload.picture,
            provider: providerEnum.google,
            role: role.USER
        }
    });
    console.log("6- User created:", user._id);
        return createLoginCredentials(user);}