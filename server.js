const express = require("express")
const session = require("express-session");
const MongoDBSession = require('connect-mongodb-session')(session);
const connectToDb = require("./DB/connect.js")
const app = express()
const userRouter = require('./Routers/userRouter.js')
const courseRouter = require('./Routers/courseRouter.js')
const chaptreRouter = require('./Routers/chaptreRouter.js')
let ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser')
let User = require("./DB/models/User")
let Course = require("./DB/models/Course")
let Chaptre = require("./DB/models/Chapter")

const imgModel = require('./DB/models/model')
const fileUpload = require("express-fileupload");
app.use(fileUpload());


const upload = require('./middleware/multer')




app.use(express.static(__dirname + '/testFrontEnd'));
app.use(cookieParser())

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Connect to Data Base
connectToDb()

const store = new MongoDBSession({
    uri: "mongodb://127.0.0.1:27017/",
    collection: "mySessions"
})

app.use(session({
    secret: "ensaj application",
    resave: false,
    saveUninitialized: false,
    store: store,
}))

app.get('/', (req, res) => {
    res.render('index1', {title: ''})
})

app.get('/1', async (req, res) => {
    let course = await Course.findById(req.session.cours)
    console.log(course)
    let user = await User.findById(req.session.user_id)
    let arr = course.chaptre.toString().split(',')
    let chaptres = await Chaptre.find({'_id': { $in: arr}});
    res.render('generalCours', {chaptres: chaptres, course: course})
})

app.get('/2/:chaptre/:name', async(req, res) => {
  let chaptre = await Chaptre.findById(req.params["chaptre"])
  let video = chaptre.video.find(video => {return video.title === req.params["name"]})
  res.render('videopage', {video: video.name})
})

app.get('/3/:name', async(req, res) => {
  res.render('videopage', {video: '', pdf: req.params["name"]})
})
app.get('/4', async(req, res) => {
  let user = await User.findById(req.session.user_id)
  res.render('test2', {user: user})
})
  


app.use(userRouter)
app.use(courseRouter)
app.use(chaptreRouter)


app.listen(3000)