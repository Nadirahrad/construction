// middleware/authenticate.js
/*const jwt = require('jsonwebtoken');

// Middleware utama untuk pengesahan
const authenticate = (req, res, next) => {
    try {
        // Ambil token daripada header Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ error: 'Access denied. No token provided.' });
        }

        // Sahkan token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.userId = decoded.userId; // Lampirkan ID pengguna ke req
        req.userRole = decoded.role; // Lampirkan peranan pengguna ke req
        next();
    } catch (err) {
        res.status(401).send({ error: 'Invalid or expired token.' });
    }
};

// Middleware tambahan untuk menyemak peranan pengguna
const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.userRole !== requiredRole) {
            return res.status(403).send({ error: 'Access denied: insufficient permissions.' });
        }
        next();
    };
};

// Eksport fungsi
module.exports = { authenticate, checkRole };*/

// middleware/authenticate.js
const jwt = require('jsonwebtoken');

// Middleware utama untuk pengesahan
const authenticate = (req, res, next) => {
    try {
        // Ambil token daripada header Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ error: 'Access denied. No token provided.' });
        }

        // Sahkan token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.userId = decoded.userId; // Lampirkan ID pengguna ke req
        req.userRole = decoded.role; // Lampirkan peranan pengguna ke req

        console.log('Decoded token:', decoded); // Debugging: Paparkan token
        next();
    } catch (err) {
        console.error('Authentication error:', err.message); // Debugging
        res.status(401).send({ error: 'Invalid or expired token.' });
    }
};

// Middleware tambahan untuk menyemak peranan pengguna
const checkRole = (requiredRole) => {
    return (req, res, next) => {
        console.log(`User role: ${req.userRole} | Required role: ${requiredRole}`); // Debugging
        if (req.userRole !== requiredRole) {
            console.log('Access denied. Insufficient permissions.'); // Debugging
            return res.status(403).send({ error: 'Access denied: insufficient permissions.' });
        }
        console.log('Access granted.'); // Debugging
        next();
    };
};

// Eksport fungsi
module.exports = { authenticate, checkRole };


