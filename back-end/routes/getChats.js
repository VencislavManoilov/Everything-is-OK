const express = require("express");
const route = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");

route.get(
    "/",
    isAuthenticated,
    (req, res) => {
        const query = "SELECT * FROM concerns WHERE user_id = ?";
        req.db.query(query, [req.session.userId], (error, results) => {
            if(error) {
                console.log(error);
                return res.status(500).json({ error: "Internal server error" });
            }

            let chat = results;
            chat.map(result => ({ id: result.id, title: result.title }));
            chat.reverse();

            return res.status(200).json(chat);
        });
    }
)

module.exports = route;