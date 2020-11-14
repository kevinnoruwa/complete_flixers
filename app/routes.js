
const {validateUser} = require("../middleware/validate.js")
const ExpressError = require("../utils/expressError.js")
const catchAsync = require("../utils/catchAsync")
const DB = require('../database/connection.js')
const session = require("express-session")
const Prevention = require('sqlstring')
const express = require('express')
const bcrypt = require('bcrypt')
const route = express.Router()






// all movies
route.get('/', (req, res) => {
    DB.query(`SELECT * FROM flixers` , (err, movies) => {
        if(err) {
            console.log(err)
        } else {
            res.render('home.ejs', {movies})
    
        }
    })   
})

// show

route.get('/movie/:id',  (req, res) => {
    let id = req.params.id  
        DB.query(`SELECT * FROM flixers WHERE id = "${id}" LIMIT 1`, (err, movie) => {
            if(err || movie.length === 0 ) {
                console.log(err)
                res.render("error.ejs", {err})
               
            }  else {
                res.render("show.ejs", {movie})
            }
        }) 
})

// sign up


route.get('/signup', (req, res) => {
    res.render('sign_up.ejs')
})


route.post("/signup", validateUser, catchAsync( async (req, res, next) => {
    const {user} = req.body
    const password = await bcrypt.hash(user.password, 12)
    DB.query(`INSERT INTO users(f_name, l_name, email, password)
    VALUES (${Prevention.escape(user.f_name)},
            ${Prevention.escape(user.l_name)},
            ${Prevention.escape(user.email)},
            ${Prevention.escape(password)})`, catchAsync( async (err, account) => {
                if(err) {
                  res.render('error.ejs', {err})
                } else {
                    res.redirect("/")
                }
            }))
}))

// log in

route.get('/login', (req, res) => {
    res.render('log_in.ejs')
})


route.post('/login', (req, res) => {
    const {user} = req.body
    DB.query(`SELECT * FROM users WHERE email = "${user.email}"`, async (err, account) => {
        try {
            if(account[0].email === user.email) {
                const validPassword = await bcrypt.compare(user.password, account[0].password)

                if(validPassword === true) {
                    req.session.user = account[0].id
                    res.redirect("/")
                } else {
                    res.send("inncorect password or username")
                }           
            } 
        } catch (e) {
            res.send("inccorect password or username")
        }   
    })    
})














route.get("/secret", async (req, res) => {
    try {
        if( !req.session.user) {
            res.redirect("/")
            
        }
        res.send("this is secret ! You cannot see me unless you are")
    } catch(e) {
        console.log(e)
    
    }
  
   
})






route.all("*", (req, res, next) => {
    next(new ExpressError("page not found", 404))
})

route.use((err, req, res, next) => {
    const {statusCode = 500} = err
    if(!err.message) {
      err.message = "something went wrong"
    }
    res.status(statusCode).render("error.ejs", {err})
  
  })



module.exports = route