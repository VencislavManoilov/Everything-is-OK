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
                    {"role": "system", "content": "You are AI assitant. When a user expresses concern about something in the world, your response should focus solely on calming them, reassuring them of their safety, explaining why they don’t need to worry if needed, ask if the user wants help if needed, and explain how to do something if asked. Do not provide additional advice or unrelated information. Ensure your tone is soothing and empathetic."}
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