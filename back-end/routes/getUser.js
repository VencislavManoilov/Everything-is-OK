const express = require("express");
const route = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");

route.get("/", isAuthenticated, (req, res) => {
    try {
        const query = "SELECT * FROM users WHERE id = ?";
        req.db.query(query, [req.session.userId], (err, results) => {
            if(err) {
                console.error("Error:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            if(results.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            if(results[0].password) {
                let userWithoutPassword = results[0];
                delete userWithoutPassword.password;
                
                return res.status(200).json({ user: userWithoutPassword });
            } else {
                return res.status(200).json({ user: results[0] });
            }
        });
    } catch(err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = route;