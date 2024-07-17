const express = require("express");
const app = express();

const PORT = 8080;

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to Everything is OK API", version: "1.0.0" });
})

app.get("*", (req, res) => {
    res.status(404).json({ message: "Not Found" });
})

app.listen(PORT, () => {
    console.log("Listening to", PORT);
})