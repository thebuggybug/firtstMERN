const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

// Initialize Middleware
// an express function to parse incoming JSON payload
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("hello friend"));

app.post("/", (req, res) => res.send(`Hello i am ${req.body.name}`));

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

// app.listen(PORT);
