const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired.', tokenExpired: true});
            }
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.userId = decoded.id;  // Attach userId to request for use in protected routes
        next();
    });
};

module.exports = authenticateToken
