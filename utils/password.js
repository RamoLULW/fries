import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);
const HASH_PREFIX = "scrypt";
const KEY_LENGTH = 64;
const SALT_BYTES = 16;

export const isPasswordHashed = (value = "") => {
    return typeof value === "string" && value.startsWith(`${HASH_PREFIX}$`);
};

export const hashPassword = async (password) => {
    if (typeof password !== "string" || password.length === 0) {
        throw new Error("Password is required");
    }

    const salt = randomBytes(SALT_BYTES).toString("hex");
    const derivedKey = await scrypt(password, salt, KEY_LENGTH);

    return `${HASH_PREFIX}$${salt}$${Buffer.from(derivedKey).toString("hex")}`;
};

export const comparePassword = async (password, storedPassword) => {
    if (typeof password !== "string" || typeof storedPassword !== "string") {
        return false;
    }

    if (!isPasswordHashed(storedPassword)) {
        return storedPassword === password;
    }

    const [, salt, storedKey] = storedPassword.split("$");

    if (!salt || !storedKey) {
        return false;
    }

    const derivedKey = await scrypt(password, salt, KEY_LENGTH);
    const storedKeyBuffer = Buffer.from(storedKey, "hex");
    const derivedKeyBuffer = Buffer.from(derivedKey);

    if (storedKeyBuffer.length !== derivedKeyBuffer.length) {
        return false;
    }

    return timingSafeEqual(storedKeyBuffer, derivedKeyBuffer);
};

export const sanitizeUser = (user) => {
    const safeUser = user.toObject ? user.toObject() : { ...user };
    delete safeUser.password;
    return safeUser;
};
