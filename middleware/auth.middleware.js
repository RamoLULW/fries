import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth = (req, res, next) => {
    const authorization = req.get("authorization") || "";

    if (!authorization.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization token is required" });
    }

    const token = authorization.slice(7).trim();

    if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
    }

    try {
        req.user = verifyAccessToken(token);
        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
