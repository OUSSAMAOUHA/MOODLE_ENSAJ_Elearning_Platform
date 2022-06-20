const express = require('express')
const Course = require('../DB/models/Course.js')
const Comment = require('../DB/models/Comment.js')

const User = require('../DB/models/User.js')
const Chaptre = require('../DB/models/Chapter.js')
const router = new express.Router()
const bcrypt = require("bcryptjs")
const upload = require('../middleware/multer')
var fs = require('fs');
var path = require('path');
const fileUpload = require('express-fileupload')

async function isAdmin(req, res, next) {
    let user = await User.findById(req.session.user_id)
    if(user.role == "prof"){
        next()
    }else res.redirect('/')
}
router.get('/coursepage/:course', async (req, res) => {
    let course = await Course.findById(req.params.course)
    let user = await User.findById(req.session.user_id)

    res.render('chapitre', {course: course, user: user})
})

router.get('/coursepage', async (req, res) => {
    let user = await User.findById(req.session.user_id)

    res.render('chapitre', {user: user})
})
router.get('/createcourse',isAdmin, async(req, res) => {
    let user = await User.findById(req.session.user_id)
    res.render('creation', {user: user})
})
router.post('/createcourse2',upload.single('image'), async(req, res) => {
    console.log(req.body.title)
    var obj = {
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        semester: req.body.semester,
        visibilite: req.body.visibilite,
        filiere: req.body.filiere,
        creator_id: req.session.user_id,
        img: {
            data: fs.readFileSync(path.join(__dirname.split("Routers")[0] + 'uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    const course = await new Course(obj)
    course.save().then(async () => {
        let user = await User.findById(req.session.user_id)
        user.courses.push(course.id)
        user.save()
        res.redirect('/course/' + course.id)
    }).catch((err) => {
        res.send(err)
    })
})

router.post('/createcourse', async(req, res) => {
    console.log(req.body)
    
    console.log("am here")
        // Uploaded path
    const uploadedFile = req.files.image;
      
        // Logging uploading file
    console.log(uploadedFile);
    let p = Date.now() + uploadedFile.name 
        // Upload path
    const uploadPath = __dirname.split("Routers")[0]+ "/testFrontEnd/files/" + p;
        // To save the file using mv() function
    var obj = {
            title: req.body.title,
            description: req.body.description,
            language: req.body.language,
            semester: req.body.semester,
            visibilite: req.body.visibilite,
            filiere: req.body.filiere,
            creator_id: req.session.user_id,
            img: p
    }
    uploadedFile.mv(uploadPath, async (err) => {
        if (err) {
            console.log(err);
        } else {
            const course = await new Course(obj)
            course.save().then(async () => {
                let user = await User.findById(req.session.user_id)
                user.courses.push(course.id)
                user.save()
                res.redirect('/course/' + course.id)
            }).catch((err) => {
                res.send(err)
            })
        };
    });
      
})

router.get('/course/:id', async (req, res) => {
    console.log(req.params['id'])

    let course = await Course.findById(req.params.id)
    console.log(course)
    let user = await User.findById(req.session.user_id)
    let arr = course.chaptre.toString().split(',')
    console.log(arr)
    new_arr = arr.filter(function(item) {
        return item !== ""
      })
      console.log(new_arr)
    if (new_arr.length != 0){
        let chaptres = await Chaptre.find({'_id': { $in: arr}});
        res.render('chapitre', {course: course, user: user, chaptres: chaptres, chaptre_id: 0})
    }else{
        res.render('chapitre', {course: course, user: user, chaptres: [], chaptre_id: 0})
    }

})

router.get('/course/edit/:chaptre/:course',isAdmin ,async (req, res) => {
    let course = await Course.findById(req.params.course)
    let user = await User.findById(req.session.user_id)
    let arr = course.chaptre.toString().split(',')
    let chaptres = await Chaptre.find({'_id': { $in: arr}});
    console.log(req.params['chaptre'])
    let chaptre = await Chaptre.findById(req.params['chaptre'])
    res.render('chapitre', {course: course, user: user, chaptres: chaptres, chaptre_id: req.params["chaptre"], chaptre: chaptre})
})

router.get('/courses/:id', async (req,res)=>{
    let course = await Course.findById(req.params.id)
    console.log(course)
    let user = await User.findById(req.session.user_id)
    let arr = course.chaptre.toString().split(',')
    new_arr = arr.filter(function(item) {
        return item !== ""
      })
      console.log(new_arr)
    if (new_arr.length != 0){
        let chaptres = await Chaptre.find({'_id': { $in: arr}});
        res.render('chapitre', {course: course, user: user, chaptres: chaptres, chaptre_id: 0})
    }else{
        res.render('chapitre', {course: course, user: user, chaptres: [], chaptre_id: 0})
    }
})

router.get("/courses", async (req, res) => {
    let courses = await Course.find({})
    let user = await User.findById(req.session.user_id)
    res.render("courses", {courses: courses, user: user, filiere: '2ite', semester: 's1'})
})

// Filtre courses

router.get("/courses/:filiere/:semester", async (req, res) => {
    let courses = await Course.find({filiere: req.params.filiere, semester: req.params.semester})
    let user = await User.findById(req.session.user_id)
    res.render("courses", {courses: courses, user: user, filiere: req.params.filiere, semester: req.params.semester})
})

router.get('/mycourses', async(req, res) => {
    let user = await User.findById(req.session.user_id)
    let arr = user.courses.toString().split(',')
    let courses
    if(arr != 0){
        courses = await Course.find({'_id': { $in: arr}});
    }else{
        courses = []
    }
    
    res.render("mycourses", {user: user, courses: courses})
})

// Course Gneral Page And showing videos and pdf
router.get('/generalcourse/:id', async (req, res) => {

    let course = await Course.findById(req.params.id)
    let creator = await User.findById(course.creator_id)
    console.log(course.creator_id)
    let user = await User.findById(req.session.user_id)
    let arr = course.chaptre.toString().split(',')
    let chaptres = await Chaptre.find({'_id': { $in: arr}});
    res.render('generalCours', {chaptres: chaptres, course: course, user: user, creator: creator})
})

router.get('/generalcourse/vid/:chaptre/:name', async(req, res) => {
    console.log(req.params.chaptre.split('\n'))
    let user = await User.findById(req.session.user_id)
  let chaptre = await Chaptre.findById(req.params["chaptre"])
  let video = chaptre.video.find(video => {return video.title === req.params["name"]})
  res.render('videopage', {video: video.name, pdf: '', user: user, isPdf: false})
})

router.get('/generalcourse/pdf/:name', async(req, res) => {
    let user = await User.findById(req.session.user_id)
  res.render('videopage', {video: '', pdf: req.params["name"], user: user, isPdf: true})
})

// Course Description page and comment
router.get('/coursedoc/:name', async (req, res) => {
    console.log(req.params.name)
    let course = await Course.findById(req.params["name"])
    let user = await User.findById(req.session.user_id)
    let arr = course.comments.toString().split(',')
    let arr1 = course.chaptre.toString().split(',')
    let chaptres = await Chaptre.find({'_id': { $in: arr1}});
    new_arr = arr.filter(function(item) {
        return item !== ""
      })
    if(new_arr.length != 0){
        let comments1 = await Comment.find({'_id': { $in: arr}});
        let comments = comments1.reverse()
        res.render('descriptionCours', {course: course, user: user, comments: comments, chaptres: chaptres})
    }else{
        res.render('descriptionCours', {course: course, user: user, chaptres: chaptres, comments: []})
    }

})


router.post('/sendcomment/:course', async (req, res) => {
    let user = await User.findById(req.session.user_id)
    let obj = {
        content: req.body.content,
        username: user.username,
        img: user.img
    }
    let comment = new Comment(obj)
    comment.save().then(async () => {
        let course = await Course.findById(req.params.course)
        course.comments.push(comment.id)
        course.save()
    })
    res.redirect('/coursedoc/'+req.params.course)
})
module.exports = router