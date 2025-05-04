import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token required' });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        // Add user info to request
        req.user = decoded;
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        
        res.status(500).json({ message: 'Server error' });
    }
};

export const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Require Admin Role!' });
  }
  next();
};

export const isTeacher = (req, res, next) => {
  if (req.userRole !== 'teacher' && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Require Teacher Role!' });
  }
  next();
};