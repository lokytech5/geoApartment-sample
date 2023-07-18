function auth(req, res, next) {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access denied. No token provided.')

    try {
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token')
    }
}

module.exports = auth;