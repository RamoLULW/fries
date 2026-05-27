import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import User from "../models/users.model.js";
import { hashPassword, sanitizeUser } from "../utils/password.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.resolve(projectRoot, ".env") });

const ROOT_NAME = process.env.ROOT_NAME || "Root User";
const ROOT_USERNAME = process.env.ROOT_USERNAME || "root";
const ROOT_PASSWORD = process.env.ROOT_PASSWORD || "root";

const ensureRootUser = async () => {
    if (!process.env.URI) {
        throw new Error("URI is not defined in the .env file");
    }

    await mongoose.connect(process.env.URI);

    try {
        const hashedPassword = await hashPassword(ROOT_PASSWORD);

        const user = await User.findOneAndUpdate(
            { username: ROOT_USERNAME },
            {
                name: ROOT_NAME,
                username: ROOT_USERNAME,
                password: hashedPassword,
            },
            {
                upsert: true,
                returnDocument: "after",
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        console.log(JSON.stringify({
            msg: "Root user is ready",
            user: sanitizeUser(user),
        }));
    } finally {
        await mongoose.disconnect();
    }
};

ensureRootUser().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
});
