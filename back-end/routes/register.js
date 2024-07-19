const express = require("express");
const route = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");

route.post(
    '/',
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    ],
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            let errorMessages = [];
            for(let i = 0; i < errors.array().length; i++) {
                errorMessages.push(errors.array()[i].msg);
            }
            return res.status(400).json({ errors: errorMessages });
        }
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        if(req.session.guest) {
            // Update the guest account to a regular account
            try {
                req.db.query('UPDATE users SET guest = ?, username = ?, email = ?, password = ? WHERE id = ?',
                [false, username, email, hashedPassword, req.session.userId], () => {
                    req.session.username = username;
                    req.session.guest = false;
    
                    return res.json({ success: true });
                });
            } catch(err) {
                console.log(err);
                return res.status(500).json({ error: "Internal server error" });
            }
        } else {
            // Check if the username already exists
            try {
                req.db.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
                    if (results.length > 0) {
                        return res.status(400).json({ error: 'Username already exists' });
                    }
    
                    // Create a new regular account
                    req.db.query('INSERT INTO users (guest, username, email, password) VALUES (?, ?, ?, ?)', 
                    [false, username, email, hashedPassword], (error, results) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ error: "Internal server error" });
                        }

                        req.session.userId = results.insertId;
                        req.session.username = username;
                        req.session.email = email;
                        req.session.guest = false;
    
                        res.status(200).json({ success: true });
                    });
                });
            } catch(err) {
                console.log(err);
                return res.status(500).json({ error: "Internal server error" });
            }
        }
    }
);

module.exports = route;