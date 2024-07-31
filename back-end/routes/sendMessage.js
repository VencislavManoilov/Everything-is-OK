const express = require("express");
const route = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const { body, validationResult } = require("express-validator");

route.post(
    "/",
    isAuthenticated,
    [
        body("chatId").notEmpty().withMessage("Chat ID is required"),
        body("message").notEmpty().withMessage("Message is required")
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

        const { chatId, message } = req.body;

        const checkChatQuery = "SELECT * FROM concerns WHERE id = ?";
        req.db.query(checkChatQuery, [chatId], async (error, results) => {
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
                let chat = [...JSON.parse(results[0].messages), { "role": "user", "content": message }];
                const completion = await req.openai.chat.completions.create({
                    messages: chat,
                    model: "gpt-4o-mini"
                });

                chat.push(completion.choices[0].message);

                try {
                    const query = "UPDATE concerns SET messages = ? WHERE id = ?";
                    req.db.query(query, [
                        JSON.stringify(chat),
                        chatId
                    ]);

                    return res.status(200).json({ success: true, chat: chat });
                } catch(err) {
                    console.log(err);
                    return res.status(500).json({ error: "Internal server error" });
                }
            } catch(err) {
                console.log(err);
                return res.status(500).json({ error: "Internal server error" });
            }
        })
    }
);

module.exports = route;