const express = require("express");
const route = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const { body, validationResult } = require("express-validator");

route.post(
    "/",
    isAuthenticated,
    (req, res) => {
        try {
            const query = "INSERT INTO concerns (user_id, messages) VALUES (?, ?)";
            req.db.query(query, [
                req.session.userId,
                JSON.stringify([
                    {"role": "system", "content": "You are a helpful and calming assistant. A user just shared a concern with you. Your job is to calm them by shortly explaining why the concern is not scary."}
                ])
            ], (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Internal server error" });
                }

                return res.status(200).json({ success: true, id: results.insertId });
            });
        } catch(err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
)

module.exports = route;