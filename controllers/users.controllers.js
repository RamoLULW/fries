import User from "../models/users.model.js";
import { hashPassword, sanitizeUser } from "../utils/password.js";

const normalizeText = (value) => {
    return typeof value === "string" ? value.trim() : value;
};

const handleUserWriteError = (res, error) => {
    if (error?.code === 11000) {
        return res.status(409).json({ error: "Username already exists" });
    }

    if (error?.name === "ValidationError") {
        const firstMessage = Object.values(error.errors)[0]?.message;
        return res.status(400).json({ error: firstMessage || "Invalid user data" });
    }

    return res.status(500).json({ error: error.message });
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const postUser = async (req, res) => {
    try {
        const name = normalizeText(req.body.name);
        const username = normalizeText(req.body.username);
        const password = req.body.password;

        if (!name || !username || !password) {
            return res.status(400).json({ error: "Name, username and password are required" });
        }

        const hashedPassword = await hashPassword(password);
        const user = new User({ name, username, password: hashedPassword });
        await user.save();
        res.status(201).json(sanitizeUser(user));
    } catch (error) {
        handleUserWriteError(res, error);
    }
};

export const putUser = async (req, res) => {
    try {
        const { id } = req.params;
        const name = normalizeText(req.body.name);
        const username = normalizeText(req.body.username);
        const { password } = req.body;
        const update = {};

        if (name !== undefined) {
            if (!name) {
                return res.status(400).json({ error: "Name cannot be empty" });
            }
            update.name = name;
        }

        if (username !== undefined) {
            if (!username) {
                return res.status(400).json({ error: "Username cannot be empty" });
            }
            update.username = username;
        }

        if (password !== undefined) {
            if (!password) {
                return res.status(400).json({ error: "Password cannot be empty" });
            }
            update.password = await hashPassword(password);
        }

        if (Object.keys(update).length === 0) {
            return res.status(400).json({ error: "Provide at least one field to update" });
        }

        const user = await User.findByIdAndUpdate(
            id,
            update,
            { returnDocument: "after", runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        handleUserWriteError(res, error);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ msg: "User deleted", id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
