const express = require("express");
const app = express();
const cors = require("cors");

const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:3000', 'http://frontend:3000', 'http://127.0.0.1:3000', process.env.FRONTEND_URL],
    credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to Everything is OK API", version: "1.0.0" });
})

app.get("*", (req, res) => {
    res.status(404).json({ message: "Not Found" });
})

app.listen(PORT, () => {
    console.log("Listening to", PORT);
})