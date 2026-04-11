import User from "../models/users.model.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
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
        const user = new User({ name, username, password });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const putUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, password } = req.body;
        const user = await User.findByIdAndUpdate(
            id,
            { name, username, password },
            { new: true, runValidators: true }
        );
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
