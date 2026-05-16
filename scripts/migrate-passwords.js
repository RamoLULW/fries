import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import User from "../models/users.model.js";
import { hashPassword, isPasswordHashed } from "../utils/password.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.resolve(projectRoot, ".env") });

const migratePasswords = async () => {
    if (!process.env.URI) {
        throw new Error("URI is not defined in the .env file");
    }

    await mongoose.connect(process.env.URI);

    const users = await User.find();
    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
        if (isPasswordHashed(user.password)) {
            skippedCount += 1;
            continue;
        }

        if (typeof user.password !== "string" || user.password.length === 0) {
            skippedCount += 1;
            console.warn(`Skipped user ${user.username}: missing password`);
            continue;
        }

        user.password = await hashPassword(user.password);
        await user.save();
        migratedCount += 1;
        console.log(`Migrated password for ${user.username}`);
    }

    console.log(`Migration complete. Updated ${migratedCount} users, skipped ${skippedCount}.`);
};

try {
    await migratePasswords();
} catch (error) {
    console.error("Password migration failed:", error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
