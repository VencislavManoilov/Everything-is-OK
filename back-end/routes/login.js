const express = require("express");
const route = express.Router();
const bcrypt = require('bcryptjs');

route.post('/', async (req, res) => {
    const { username, password } = req.body;

    req.db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
        if (error) throw error;

        if (results.length === 0) {
            return res.status(401).send('User not found');
        }

        const user = results[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid password');
        }

        if (req.session.guest) {
            // Update the guest account to regular account
            connection.query('UPDATE users SET username = ?, password = ?, guest = ? WHERE id = ?', 
                [username, await bcrypt.hash(password, 10), false, req.session.userId], (error) => {
                if (error) throw error;

                req.session.username = username;
                req.session.guest = false;

                res.send('Guest account converted to regular account');
            });
        } else {
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.guest = user.guest;

            res.send('Logged in');
        }
    });
});

module.exports = route;