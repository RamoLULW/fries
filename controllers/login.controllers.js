import User from "../models/users.model.js";
import { comparePassword, hashPassword, isPasswordHashed, sanitizeUser } from "../utils/password.js";
import { createAccessToken } from "../utils/jwt.js";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ login: false, msg: "Username and password are required", user: {} });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ login: false, msg: "User not found", user: {} });
        }

        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ login: false, msg: "Wrong password", user: {} });
        }

        // Upgrade any legacy plain-text password the first time the user logs in.
        if (!isPasswordHashed(user.password)) {
            user.password = await hashPassword(password);
            await user.save();
        }

        const safeUser = sanitizeUser(user);
        const token = createAccessToken(safeUser);

        res.json({ login: true, msg: "Ok", user: safeUser, token });
    } catch (error) {
        res.status(500).json({ login: false, msg: error.message, user: {} });
    }
};
