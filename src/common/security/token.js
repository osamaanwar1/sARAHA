
import configService from "../../config/config.service.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import { tokenType } from "../enum/tokentype.js";
import * as exception from "../utils/exception.js";
import { role } from "../enum/RoleEnum.js";

const { JWT_ISSUER, ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } =
    configService;

// Secrets separated by role and token type
const secrets = {
    [role.USER]: {
        [tokenType.ACCESS]: configService.ACCESS_SECRET_USER,
        [tokenType.REFRESH]: configService.REFRESH_SECRET_USER
    },

    [role.ADMIN]: {
        [tokenType.ACCESS]: configService.ACCESS_SECRET_ADMIN,
        [tokenType.REFRESH]: configService.REFRESH_SECRET_ADMIN
    }
};

// Token lifetimes
const lifeTime = {
    [tokenType.ACCESS]: ACCESS_EXPIRES_IN,
    [tokenType.REFRESH]: REFRESH_EXPIRES_IN
};

// Generate Token
export const generateToken = ({
                                  payload = {},
                                  role: userRole,
                                  type = tokenType.ACCESS,
                                  jti
                              }) => {
    const key = secrets[userRole]?.[type];

    if (!key) {
        exception.UnauthorizedException("Invalid token configuration");
    }

    return jwt.sign(payload, key, {
        algorithm: "HS256",
        audience: userRole,
        issuer: JWT_ISSUER,
        expiresIn: lifeTime[type],
        jwtid: jti ?? crypto.randomUUID()
    });
};

// Verify Token
export const verifyToken = (token, type = tokenType.ACCESS) => {
    try {
        const decoded = jwt.decode(token);

        if (!decoded || typeof decoded === "string" || !decoded.aud) {
            exception.UnauthorizedException("Invalid token");
        }

        const userRole = decoded.aud;
        const secret = secrets[userRole]?.[type];

        if (!secret) {
            exception.UnauthorizedException("Invalid token");
        }

        return jwt.verify(token, secret, {
            algorithms: ["HS256"],
            audience: userRole,
            issuer: JWT_ISSUER
        });

    } catch (err) {
        if (err.name === "TokenExpiredError") {
            exception.UnauthorizedException("Token expired");
        }

        exception.UnauthorizedException("Invalid token");
    }
};

// Create Login Credentials
export const createLoginCredentials = (user) => {
    const payload = {
        sub: String(user._id)
    };
    console.log("User role:", user.role);
    console.log("Available roles:", Object.keys(secrets));
    return {
        accessToken: generateToken({
            payload,
            role: user.role,
            type: tokenType.ACCESS
        }),

        refreshToken: generateToken({
            payload,
            role: user.role,
            type: tokenType.REFRESH
        })
    };
};
