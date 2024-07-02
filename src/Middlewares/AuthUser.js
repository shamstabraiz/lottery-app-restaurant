import { verifyToken } from "../utils/jwtToken.js";

const checkAuth = (...roles) => {
    return (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const decodedToken = verifyToken(authorization);
        if (!decodedToken) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        if (!roles.includes(decodedToken.role)) {
            return res.status(403).json({
                message: 'Forbidden'
            });
        }
        req.user = decodedToken;
        next();
    }
}



export default checkAuth;