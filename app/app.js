const session = require("express-session")
const bodyParser = require('body-parser')
const router = require('./routes.js')
const express = require('express')
const app = express()


const sessionConfig = {
    saveUninitialized : true,
    secret: "secret",
    resave: false,
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
app.use('/', router)





app.listen(3000, () => {
    console.log('server has started')
})