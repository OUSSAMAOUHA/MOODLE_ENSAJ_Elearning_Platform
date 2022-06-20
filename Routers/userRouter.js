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
    }
    const user = await new User(obj)
    user.save().then(() => {
        req.session.user_id = user.id
        res.redirect('/mycourses')
    }).catch((err) => {
        res.send(err)
    })
})



router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if(user){
            req.session.user_id = user.id
        }
        res.redirect('/mycourses')
        
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
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect('/')
    })
})

router.get('/addcourse/:coursid', async (req, res) => {
    let user = await User.findById(req.session.user_id)
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

router.get('/mycourses22', async(req, res) => {
    let user = await User.findById(req.cookies.user_id)
    let arr = user.courses.toString().split(',')
    let courses = await Course.find({'_id': { $in: arr}});
    res.send(courses)

})

router.get('/profile', async(req, res) => {
    let user = await User.findById(req.session.user_id)
    res.render("profile", {user: user})
})

router.get('/profileedit', async(req, res) => {
    let user = await User.findById(req.session.user_id)
    res.render("profileedit", {user: user})
})

router.post('/update', async(req, res) => {
    console.log(req.body)
    let user = await User.findByIdAndUpdate(req.session.user_id, req.body)
    user.save()
    res.redirect('/profile')
})

router.post('/update/profile', async(req, res) => {
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
            username: req.body.username,
            email: req.body.email,
            img: p
    }
    uploadedFile.mv(uploadPath, async (err) => {
        if (err) {
            console.log(err);
        } else {
            const user = await User.findByIdAndUpdate(req.session.user_id, obj)
            user.save().then(() => {
                console.log("saved")
                res.redirect('/profile')
            }).catch((err) => {
                res.send(err)
            })
        };
    });
      
})

module.exports = router