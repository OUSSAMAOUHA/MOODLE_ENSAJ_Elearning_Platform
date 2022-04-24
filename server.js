const { default: mongoose } = require("mongoose")
const express = require("express")
const connectToDb = require("./DB/connect.js")
const User = require("./DB/models/User.js")
const app = express()
const userRouter = require('./Routers/userRouter.js')
const courseRouter = require('./Routers/courseRouetr.js')
const multer  = require('multer')
let ejs = require('ejs');
const upload = require('./middleware/multer')
var fs = require('fs');
var path = require('path');
var imgModel = require('./DB/models/imgModel')
var cookieParser = require('cookie-parser')




app.use(express.static(__dirname + '/testFrontEnd'));
app.use(cookieParser())

  


app.set('view engine', 'ejs')
app.set('views', './views')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Data Base
connectToDb()


app.get('/', (req, res) => {
    res.render('index', {title: ''})
})


app.use(userRouter)
app.use(courseRouter)
app.get('/cours', (req, res) => {
    console.log(req.cookies.username)
})

app.listen(3000)