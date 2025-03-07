const express = require("express")
const bcrypt = require("bcrypt")
const db = require("../config/db")
const router = express.Router()

router.get("/registrer", (req, res) => {
    res.render("registrer")
})

router.post("/registrer", async (req, res) => {
    const {name, email, password} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    db.query("insert into users (name, email, password) values (?, ?, ?)", [name, email, hashedPassword], (err)=>{
        if (err) {
            return res.status(500).send("error registrering user")
        }
        res.redirect("/auth/login")
    })
})

router.get("/login", (req, res)=>{
    res.render("login");
})