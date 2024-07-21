const express = require("express");
const route = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");

route.post(
    '/',
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("password").notEmpty().withMessage("Password is required")
    ]
    , async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            let errorMessages = [];
            for(let i = 0; i < errors.array().length; i++) {
                errorMessages.push(errors.array()[i].msg);
            }
            return res.status(400).json({ errors: errorMessages });
        }

        const { username, password } = req.body;

        req.db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
            if(error) {
                console.log(error);
                return res.status(500).json({ error: "Internal server error" });
            }

            if(results.length === 0) {
                return res.status(401).json({ error: 'User not found' });
            }

            const user = results[0];

            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            if(req.session.guest) {
                // Delete the guest account and login to regular account
                req.db.query('DELETE FROM users WHERE id = ?', [req.session.userId], (error) => {
                    if(error) {
                        console.log(error);
                        return res.status(500).json({ error: "Internal server error" });
                    };
                });
            }

            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.guest = user.guest;

            res.status(200).json({ success: true });
        });
    }
);

module.exports = route;