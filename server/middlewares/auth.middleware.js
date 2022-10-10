const jwt = require('jsonwebtoken');

const AccessToken = require('../models/access_token.model');

async function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).send({
            data: null,
            message: 'Authorization header is not present'
        });
    }

    try {
        const accessToken = await AccessToken.where('token', token).fetch({ require: false });

        if (!accessToken) {
            return res.status(401).send({
                data: null,
                message: 'Please do login to get a valid Access Token'
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send({
                    data: null,
                    message: err.message
                });
            }

            req.user = user
            next();
        });
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: 'ERROR',
            error
        });
    }
}

module.exports = authMiddleware;