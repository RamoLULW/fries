import User from "../models/users.model.js";
import { hashPassword, sanitizeUser } from "../utils/password.js";

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
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(400).json({ error: "Name, username and password are required" });
        }

        const hashedPassword = await hashPassword(password);
        const user = new User({ name, username, password: hashedPassword });
        await user.save();
        res.status(201).json(sanitizeUser(user));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const putUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, password } = req.body;
        const update = {};

        if (name !== undefined) {
            update.name = name;
        }

        if (username !== undefined) {
            update.username = username;
        }

        if (password !== undefined) {
            update.password = await hashPassword(password);
        }

        const user = await User.findByIdAndUpdate(
            id,
            update,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
