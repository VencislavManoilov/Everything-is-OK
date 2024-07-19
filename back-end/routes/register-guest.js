const express = require("express");
const route = express.Router();

route.post('/', (req, res) => {
    const guestUsername = `guest_${Date.now()}`;

    req.db.query('INSERT INTO users (username, guest) VALUES (?, ?)', [guestUsername, true], (error, results) => {
        if(error) {
            console.log(error);
            return res.status(500).json({ error: "Internal server error" });
        }

        req.session.userId = results.insertId;
        req.session.username = guestUsername;
        req.session.guest = true;

        res.status(200).json({ success: true });
    });
});

module.exports = route;