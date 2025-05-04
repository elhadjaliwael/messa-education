import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET,
            (err, decoded) => {
                if (err) return res.status(401).json({ message: 'Unauthorized' });
                req.user = {
                    id: decoded.id,
                    role: decoded.role
                };
                next();
            }
        );
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};