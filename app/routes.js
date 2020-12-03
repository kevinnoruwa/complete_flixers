
const {validateUser} = require("../middleware/validate.js")
const ExpressError = require("../utils/expressError.js")
const catchAsync = require("../utils/catchAsync")
const DB = require('../database/connection.js')
const session = require("express-session")
const Prevention = require('sqlstring')
const express = require('express')
const bcrypt = require('bcrypt')
const route = express.Router()


// function paginatedResults(model){
//     return(req, res, next) => {
//         const page  = parseInt(req.query.page)
//         const limit = parseInt(req.query.limit)
//         const startIndex = (page - 1) * limit
//         const endIndex = page * limit 
//         const results = {}
    
//         if(endIndex  < users.length ){
//             results.next = {
//                 page: page + 1,
//                 limit: limit 
//             }
    
//         }
//         if(startIndex > 0) {
//             results.prev = {
//                 page: page - 1,
//                 limit: limit 
//             }
    
//         }
    
      

//        results.results = model.slice(startIndex, endIndex)
//         res.paginatedResults = results
//         next();

        
//     }
   
// }
// route.get('/users', (req, res) => {
//     const page  = parseInt(req.query.page)
//     const limit = parseInt(req.query.limit)
//     const startIndex = (page - 1) * limit
//     const endIndex = page * limit 
//     const results = {}

//     if(endIndex  < users.length ){
//         results.next = {
//             page: page + 1,
//             limit: limit 
//         }

//     }
//     if(startIndex > 0) {
//         results.prev = {
//             page: page - 1,
//             limit: limit 
//         }

//     }

  

//    results.results = users.slice(startIndex, endIndex)
//     res.json(results)
// })




// all movies
route.get('/', (req, res) => {
    DB.query(`SELECT * FROM flixers ORDER BY id ASC LIMIT 8 OFFSET 0` , (err, movies) => {
        
        if(err) {
            console.log(err)
        } else {
            
            return res.render('home.ejs', {movies})
       
    
        }
    })   
})

route.get('/page=1', (req, res) => {
    DB.query(`SELECT * FROM flixers ORDER BY id ASC LIMIT 8 OFFSET 0 ` , (err, movies) => {
        
        if(err) {
            console.log(err)
        } else {
            return res.render('home.ejs', {movies})
    
        }
    })   
})

route.get('/page=2', (req, res) => {
    DB.query(`SELECT * FROM flixers ORDER BY id ASC LIMIT 8 OFFSET 8` , (err, movies) => {
        
        if(err) {
            console.log(err)
        } else {
            return res.render('home.ejs', {movies})
    
        }
    })   
})

route.get('/page=3', (req, res) => {
    DB.query(`SELECT * FROM flixers ORDER BY id ASC LIMIT 8  OFFSET 16` , (err, movies) => {
        
        if(err) {
            console.log(err)
        } else {
            return res.render('home.ejs', {movies})
    
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
    const auth = req.session.user
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
                    req.flash("success", 'Welcome to flixers!')
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
                    req.flash("success", 'Welcome back to flixers!')
                    res.redirect("/")
                } else {
                    req.flash('error', 'incorrect password or email')
                    return res.redirect('/login')
                }           
            } 
        } catch (e) {
            req.flash('error', 'inncorect password or email')
            return res.redirect('/login')
        }   
    })    
})



// log out 


// route.post("/logout", (req, res) => {
//     req.session.user = null;
//     res.redirect("/login")
// })





// route.get("/secret", async (req, res) => {
//     try {
//         if( !req.session.user) {
//            return res.redirect("/")
            
//         }
//         res.render("secret.ejs")
//     } catch(e) {
//         console.log(e)
    
//     }
  
   
// })







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