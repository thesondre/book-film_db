const express = require("express")
const bcrypt = require("bcrypt")
const db = require("../config/db")
const router = express.Router()

router.get("/register", (req, res) => {
    res.render("register")
})

router.post("/register", async (req, res) => {
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

router.post("/login", (req, res)=>{
    const {email, password} = req.body
    console.log(req.body)
    db.query("select * from users where email=?",[email], async(err, result)=>{
        if (err || result.length===0){
            return res.status(400).send("User not found")
        }
        const user = result[0]
        const match = await bcrypt.compare(password, user.password)
        if(!match){
            return res.status(400).send("Wrong password")
        }
        req.session.user = user
        res.redirect("/items/dashboard")
    })
})

router.get("/logout", (req, res)=>{
    req.session.destroy()
    res.redirect("/")
})


module.exports = router