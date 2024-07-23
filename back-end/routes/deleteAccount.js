const express = require("express");
const route = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");

route.delete("/", isAuthenticated, (req, res) => {
    try {
        const query = "DELETE FROM users WHERE id = ?";
        req.db.query(query, [req.session.userId], (error, results) => {
            if(error) {
                console.log(error);
                return res.status(500).json({ error: "Internal server error" });
            }
        });

        req.session.destroy();

        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = route;