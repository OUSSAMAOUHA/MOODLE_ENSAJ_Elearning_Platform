const express = require('express')
const User = require('../DB/models/User.js')
const Course = require('../DB/models/Course.js')
const router = new express.Router()
const bcrypt = require("bcryptjs")
const upload = require('../middleware/multer')
var fs = require('fs');
var path = require('path');





router.post('/signup',upload.single('image'), async(req, res) => {
    var obj = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        img: {
            data: fs.readFileSync(path.join(__dirname.split("Routers")[0] + 'uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    const user = await new User(obj)
    user.save().then(() => {
        res.render('loged', { title: 'logged' })
    }).catch((err) => {
        res.send(err)
    })
})



router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.cookie('user_id', user.id);
        res.render('loged', { user: user })
    }catch(e){
        res.render('index', { title: 'User not found' });
    }
})

router.get('/users', async (req, res) => {
    try {
        const  users = await User.find({})
        res.send(users)
    }catch(e){
        res.send("Not found")
    }
})

router.get('/logout', async (req, res) => {
    res.clearCookie('username')
    res.redirect('/')
})

router.get('/addcourse/:coursid', async (req, res) => {
    let user = await User.findById(req.cookies.user_id)
    user.courses.push(req.params['coursid'])
    user.save()
    res.redirect('/courses')

})

router.get('/deletecourse/:coursid', async (req, res) => {
    let user = await User.findById(req.cookies.user_id)
    user.courses.remove(req.params['coursid'])
    user.save()
    res.redirect('/courses')

})

router.get('/mycourses', async(req, res) => {
    let user = await User.findById(req.cookies.user_id)
    let arr = user.courses.toString().split(',')
    let courses = await Course.find({'_id': { $in: arr}});
    res.send(courses)

})



module.exports = router