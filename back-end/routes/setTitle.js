const express = require("express");
const route = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const { body, validationResult } = require("express-validator");

route.post(
    "/",
    isAuthenticated,
    [
        body("id").notEmpty().withMessage("Chat id is required"),
        body("message").notEmpty().withMessage("Message is required")
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

        const { id, message } = req.body;

        const checkChatQuery = "SELECT * FROM concerns WHERE id = ?";
        req.db.query(checkChatQuery, [id], async (error, results) => {
            if(error) {
                console.log(error);
                return res.status(500).json({ error: "Internal server error" });
            }

            if(results.length === 0) {
                return res.status(400).json({ error: "No such chat" });
            }

            if(results[0].user_id != req.session.userId) {
                return res.status(400).json({ error: "This chat is not yours" });
            }

            try {
                const getTitle = await req.openai.chat.completions.create({
                    messages: [
                        {"role": "system", "content": "Create a title for the chat based on the first message that is about a concern that the user has"},
                        {"role": "user", "content": message}
                    ],
                    model: "gpt-4o-mini"
                })

                let title = getTitle.choices[0].message.content;

                if(title[0] == '"' && title[title.length - 1] == '"') {
                    title = title.substring(1, title.length-1);
                }

                const saveQuery = "UPDATE concerns SET title = ? WHERE id = ?";
                req.db.query(saveQuery, [title, id]);

                return res.status(200).json({ success: true, title: title });
            } catch(err) {
                console.log(err);
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
)

module.exports = route;