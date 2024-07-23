const express = require("express");
const route = express.Router();
const { body, validationResult } = require("express-validator");
const isAuthenticated = require("../middleware/isAuthenticated");

route.get(
    "/",
    isAuthenticated,
    [
        body("id").notEmpty().withMessage("Chat ID is required")
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

        const { id } = req.body;

        const query = "SELECT * FROM concerns WHERE id = ?";
        req.db.query(query, [id], (error, results) => {
            if(error) {
                console.log(error);
                return res.status(500).json({ error: "Internal server error" });
            }

            if(results.length === 0) {
                return res.status(400).json({ error: "No such chat" });
            }

            return res.status(200).json({ concern: results[0] });
        });
    }
);

module.exports = route;