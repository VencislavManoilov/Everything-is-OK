function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'You are not logged in' });
    }
}

module.exports = isAuthenticated;