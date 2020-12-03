const session = require("express-session")
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const router = require('./routes.js')
const express = require('express')
require('dotenv').config()
const app = express()


const sessionConfig = {
    saveUninitialized : true,
    secret: "secret",
    resave: false,
    name: "sess",
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7, 
        httpOnly: true
    }
}


app.use(bodyParser.urlencoded({extended: true}))
app.use(session(sessionConfig))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(flash())






// flash
app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user
    next()
  })













app.use('/', router)







app.listen(3000, () => {
    console.log('server has started')
})