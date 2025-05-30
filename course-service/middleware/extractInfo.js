export const extractInfo = (req,res,next) => {
    try {
        req.user = {
            id: req.headers['x-user-id'],
            email: req.headers['x-user-email'],
            role: req.headers['x-user-role'],
            level: req.headers['x-user-level']
        };
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
