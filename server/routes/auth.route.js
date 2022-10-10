require('dotenv').config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const User = require('../models/user.model');
const AccessToken = require('../models/access_token.model');

const authRoute = express.Router();

function generateAccessToken({ username }) {
    return jwt.sign({ username }, process.env.TOKEN_SECRET, { expiresIn: '30 days' });
}

authRoute.post(
    '/register',
    body('username').isEmail(),
    body('password').isLength({ min: 5 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    data: null,
                    message: 'ERROR',
                    errors: errors.array()
                });
            }

            const { username, password } = req.body;

            const hashedPassword = bcrypt.hashSync(password, 10);

            const user = await new User().save({
                username: username,
                password: hashedPassword,
            }, { method: 'insert' });

            if (!user) {
                return res.status(500).json({
                    data: null,
                    message: 'Failed to register new user',
                });
            }

            return res.status(200).json({
                data: user,
                message: 'Success to register new user',
            });
        } catch (error) {
            return res.status(500).json({
                data: null,
                message: 'ERROR',
                error
            });
        }
    }
);

authRoute.post(
    '/login',
    body('username').exists().withMessage('Username is required'),
    body('password').exists().withMessage('Password is required'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    data: null,
                    message: 'ERROR',
                    errors: errors.array()
                });
            }

            const { username, password } = req.body;

            const user = await new User().where('username', username).fetch({ require: false });

            if (!user) {
                return res.status(401).json({
                    data: null,
                    message: 'Username or Password you entered did not match our records',
                });
            }

            if (!bcrypt.compareSync(password, user.attributes.password)) {
                return res.status(401).json({
                    data: null,
                    message: 'Username or Password you entered did not match our records',
                });
            }

            const token = generateAccessToken({ username });

            await new AccessToken().save({
                user_id: user.attributes.id,
                token: token,
            }, { method: 'insert' })

            return res.status(200).json({
                data: {
                    user,
                    token,
                },
                message: 'Success to login',
            });
        } catch (error) {
            return res.status(500).json({
                data: null,
                message: 'ERROR',
                error
            });
        }
    }
)

module.exports = authRoute