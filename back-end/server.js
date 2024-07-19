const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const mysql = require("mysql2");
const MySQLStore = require("express-mysql-session")(session);

const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure MySQL connection
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB || 'everything_is_ok',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Session store setup
const sessionStore = new MySQLStore({}, db.promise());

// Session middleware setup
app.use(session({
    key: 'session_cookie_name',
    secret: 'your_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        secure: false,
        httpOnly: true
    }
}));

const corsOptions = {
    origin: ['http://localhost:3000', 'http://frontend:3000', 'http://127.0.0.1:3000', process.env.FRONTEND_URL],
    credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to Everything is OK API", version: "1.0.0" });
})

const isAuthenticated = require("./middleware/isAuthenticated");
app.get("/user", isAuthenticated, (req, res) => {
    try {
        const query = "SELECT * FROM users WHERE id = ?";
        db.query(query, [req.session.userId], (err, results) => {
            if(err) {
                console.error("Error:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            if(results.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            if(results[0].password) {
                return res.status(200).json({ user: results[0] });
            } else {
                let userWithoutPassword = results[0];
                delete userWithoutPassword.password;

                return res.status(200).json({ user: userWithoutPassword });
            }
        });
    } catch(err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

const registerRoute = require("./routes/register");
app.use("/register", (req, res, next) => {
    req.db = db;
    next();
}, registerRoute);

const registerGuestRoute = require("./routes/register-guest");
app.use("/register-guest", (req, res, next) => {
    req.db = db;
    next();
}, registerGuestRoute);

const loginRoute = require("./routes/login");
app.use("/login", (req, res, next) => {
    req.db = db;
    next();
}, loginRoute);

const logoutRoute = require("./routes/logout");
app.use("/logout", (req, res, next) => {
    req.db = db;
    next();
}, logoutRoute);

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