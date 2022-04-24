const express = require('express')
const Course = require('../DB/models/Course.js')
const Chaptre = require('../DB/models/Chapter.js')
const router = new express.Router()
const bcrypt = require("bcryptjs")
const upload = require('../middleware/multer')
var fs = require('fs');
var path = require('path');

router.get('/coursepage', (req, res) => {
    res.render('createcourse')
})

router.post('/createcourse',upload.single('image'), async(req, res) => {
    var obj = {
        name: req.body.name,
        description: req.body.description,
        img: {
            data: fs.readFileSync(path.join(__dirname.split("Routers")[0] + 'uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    const course = await new Course(obj)
    course.save().then(() => {
        res.send(course)
    }).catch((err) => {
        res.send(err)
    })
})

router.get('/addchapter/:course', async(req, res) => {
    const chapter = await new Chaptre({name: "test"})
    chapter.save()
    console.log(chapter.name)
    let course = await Course.findById(req.params['course'])
    console.log(course)
    course.chapter.push({name: chapter.name})
    course.save()
    res.redirect('/')

})




module.exports = router