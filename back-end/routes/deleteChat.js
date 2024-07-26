const express = require("express");
const route = express.Router();
const { query, validationResult } = require("express-validator");
const isAuthenticated = require("../middleware/isAuthenticated");

route.delete(
    "/",
    isAuthenticated,
    [
        query("chatId").notEmpty().withMessage("Chat ID is required")
    ],
    (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            let errorMessages = [];
            for(let i = 0; i < errors.array().length; i++) {
                errorMessages.push(errors.array()[i].msg);
            }
            return res.status(400).json({ errors: errorMessages });
        }

        const { chatId } = req.query;

        const checkQuery = "SELECT * FROM concerns WHERE id = ?";
        req.db.query(checkQuery, [chatId], (error, results) => {
            if(error) {
                console.log(error);
                return res.status(500).json({ error: "Internal server error" });
            }

            if(results.length === 0) {
                return res.status(400).json({ error: "No such chat" });
            }

            if(results[0].user_id != req.session.userId) {
                return res.status(400).json({ error: "This chat isn't yours" });
            }

            const deleteQuery = "DELETE FROM concerns WHERE id = ?";
            req.db.query(deleteQuery, [chatId], (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(500).json({ error: "Internal server error" });
                }

                return res.status(200).json({ success: true });
            });
        })
    }
)

module.exports = route;