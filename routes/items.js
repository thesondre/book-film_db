const express = require("express")
const db = require("../config/db")
const router = express.Router()

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next()
    }
    res.redirect("/auth/login")
}

router.get("/dashboard", isAuthenticated, (req, res) => {
    db.query("select * from items", (err, items) => {
        if (err) {
            return res.status(500).send("error fetching items")
        }
        res.renderer("dashboard", {user: req.session.user, items})
    })
})

router.post("/add", isAuthenticated, (req, res) => {
    const {title, type, picture_url} = req.body
    db.query("insert into items (title, type, picture_url, user_id) values (?, ?, ?, ?)", [title, type, picture_url, req.session.user.id], (err) => {
        if(err){
            return res.status(500).send("Error adding item")
        }
        res.redirect("/items/dashboard")
    })
})

router.get("/view/:id", (req, res) => {
    const itemId = req.params.id
    db.query("select * from items where id = ?", [items], (err, items) => {
        if(err||items.length === 0){
            return res.status(500).send("Item not found")
        }
        db.query("select r.*, u.name FROM reviews r join users u on r.user_id = u.id where item_id = ?", [itemId], (err, reviews) => {
            if(err){
                return res.status(500).send("error fetching reviews")
            }
            res.render("item", {item: items[0], reviews, user:req.session.user || null})
        })
    })
})

router.post("/review/:id", isAuthenticated, (req, res) =>{
    const {rating, comment} = req.body
    const itemID = req.params.id
    db.query("insert into reviews (item_id, user_id, rating, comment) values(?, ?, ?, ?)", [itemID, req.session.user.id, rating, comment], (err)=>{
        if (err){
            return res.status(500).send("error adding review")
        }
        res.redirect(`/items/view/${itemID}`)
    })
})

router.post("/delete:id", isAuthenticated, (req, res)=>{
    const itemId = req.params.id
    db.query("delete from items where id=? and user_id =?", [itemId, req.session.user.id], (err)=>{
        if(err){
            return res.status(500).send("Error deleting item")
        }
        res.redirect("/items/dashboard")
    })
})