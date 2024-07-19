const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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

app.post("/helped", (req, res) => {
    let data = JSON.parse(fs.readFileSync("./data.json", { encoding: 'utf8' }));

    data.helped++;

    try {
        fs.writeFileSync("./data.json", JSON.stringify(data), { encoding: 'utf8' });
        return res.status(200).json({ helped: data.helped });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

app.get("/chat", async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "What is a LLM?"}
              ],
            model: "gpt-4o-mini",
        });

        return res.status(200).json({ message: completion.choices, data: completion })
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

app.get("*", (req, res) => {
    res.status(404).json({ message: "Not Found" });
})

app.listen(PORT, () => {
    console.log("Listening to", PORT);
})