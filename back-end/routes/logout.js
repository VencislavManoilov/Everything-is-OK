const express = require("express");
const route = express.Router();

route.post("/", (req, res) => {
    if(req.session.guest) {
        try {
            const query = "DELETE FROM users WHERE id = ?";
            req.db.query(query, [req.session.userId]);
            req.session.destroy();

            return res.status(200).json({ success: true });
        } catch(err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    } else {
        req.session.destroy();
        return res.status(200).json({ success: true });
    }
});

module.exports = route;