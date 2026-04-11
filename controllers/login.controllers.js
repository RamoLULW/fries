import User from "../models/users.model.js";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ login: false, msg: "User not found", user: {} });
        }

        if (user.password !== password) {
            return res.status(401).json({ login: false, msg: "Wrong password", user: {} });
        }

        res.json({ login: true, msg: "Ok", user });
    } catch (error) {
        res.status(500).json({ login: false, msg: error.message, user: {} });
    }
};
