import TokenService from "../service/tokenService.js";

const tokenService = new TokenService(process.env.SECRET_KEY, '1h');

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.auth_token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        const decoded = tokenService.verifyToken(token); 
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};

export default authMiddleware;