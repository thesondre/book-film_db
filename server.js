const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors")
const path = require("path")
const authRoutes = require("./routes/auth")
const itemRoutes = require("./routes/items");
const GTTs = require("node-gtts")("no");
dotenv.config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs")

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use("/auth", authRoutes)
app.use("/items", itemRoutes)

app.get("/", (req, res) => {
    res.render("index", {user: req.session.user || null});
})

app.post("/read", (req, res) => {
    const textArray = req.body.items
    text = textArray.join(" ")
    res.setHeader("Content-Type", "audio/mpeg")
    GTTs.stream(text).pipe(res)
    
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})