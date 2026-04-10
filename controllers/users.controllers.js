import User from "../models/users.model.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getUser = async (req, res) => {
    try {
        const {id} = req.params
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const postUser = async (req, res) => {
    try {
        const {name, username, password} = req.body
        const user = new User({name, username, password})
        await user.save()
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const putUser = async (req, res) => {
    try {
        const {id} = req.params
        const {name, username, password} = req.body
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await user.update({name, username, password});
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const {id} = req.params
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await user.destroy();
        res.json({ msg: "User deleted", id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}