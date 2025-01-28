// middleware/authenticate.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.userId = decoded.userId;
        req.userRole = decoded.role; // Attach role to the request
        next();
    } catch (err) {
        res.status(401).send({ error: 'Invalid token' });
    }
};

// Middleware to check roles
const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.userRole !== requiredRole) {
            return res.status(403).send({ error: 'Access denied: insufficient permissions' });
        }
        next();
    };
};

module.exports = { authenticate, checkRole };
