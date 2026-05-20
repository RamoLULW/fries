import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fries-dev-secret";
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

export const createAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id.toString(),
            username: user.username,
            name: user.name,
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRES_IN }
    );
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
