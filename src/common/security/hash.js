import bcrypt from 'bcrypt';
import argon2 from 'argon2';
import {HashTypes} from "../enum/hashenum.js";
const strategies = {
    [HashTypes.BCRYPT]: {
        hash: (plain) => bcrypt.hash(plain, Number(process.env.SALT_ROUNDS) || 12),
        compare: (plain, hashed) => bcrypt.compare(plain, hashed),
    },
    [HashTypes.ARGON2]: {
        hash: (plain) =>
            argon2.hash(plain, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                timeCost: 3,
                parallelism: 1,
            }),
        compare: (plain, hashed) => argon2.verify(hashed, plain),
    },
};
const getStrategy = (type) => {
    const strategy = strategies[type];
    if (!strategy) throw new Error(`Unknown hash type: "${type}"`);
    return strategy;
};


export const detectHashType = (hashed) => {
    if (hashed.startsWith('$argon2')) return HashTypes.ARGON2;
    if (hashed.startsWith('$2')) return HashTypes.BCRYPT;
    throw new Error('Unrecognized hash format');
};

export const generateHash = ({ plainText, type = HashTypes.ARGON2 }) =>
    getStrategy(type).hash(plainText);

export const compareHash = ({ plainText, hashed }) =>
    getStrategy(detectHashType(hashed)).compare(plainText, hashed);
