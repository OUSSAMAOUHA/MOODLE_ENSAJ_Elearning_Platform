const express = require('express')
const Course = require('../DB/models/Course.js')
const User = require('../DB/models/User.js')
const Chaptre = require('../DB/models/Chapter.js')
const router = new express.Router()
const bcrypt = require("bcryptjs")
const upload = require('../middleware/multer')
var fs = require('fs');
var path = require('path');


router.post("/upload/:id_chaptre/:course", async(req, res) => {
    console.log(req.body)
    // When a file has been uploaded
    if (req.files && Object.keys(req.files).length !== 0) {
      console.log("am here")
      // Uploaded path
      const uploadedFile = req.files.image;
    
      // Logging uploading file
      console.log(uploadedFile);
      let p = Date.now() + uploadedFile.name 
      // Upload path
      const uploadPath = __dirname.split("Routers")[0]+ "/testFrontEnd/files/" + p;
      // To save the file using mv() function
      let obj = {
        title: req.body.title,
        description: req.body.description,
        name: p
      }
      let chaptre = await Chaptre.findById(req.params.id_chaptre)
      chaptre.files.push(obj)
      chaptre.save()
      uploadedFile.mv(uploadPath, async (err) => {
        if (err) {
          console.log(err);
          res.send("Failed !!");
        } else {
            res.redirect('/course/' + req.params.course)
        };
      });
    } else res.send("No file uploaded !!");
});

router.post("/uploadvid/:id_chaptre/:course", async (req, res) => {
  let chaptre = await Chaptre.findById(req.params.id_chaptre)
  chaptre.video.push(req.body)
  chaptre.save()
  res.redirect('/course/' + req.params.course)
})

router.post('/addchaptre/:id', async(req, res) => {
    const chapter = await new Chaptre(req.body)
    chapter.save()
    let course = await Course.findById(req.params.id)
    course.chaptre.push(chapter.id)
    course.save()
    res.redirect('/course/' + req.params.id)
})

router.post('/editchaptre/:chaptre/:course', async (req, res) => {
  const chaptre = await Chaptre.findByIdAndUpdate(req.params.chaptre, req.body)
  chaptre.save()
  res.redirect("/course/" + req.params.course)
})

router.get('/deletechaptre/:chaptre/:course', async (req, res) => {
  const chaptre = await Chaptre.findByIdAndDelete(req.params["chaptre"])
  res.redirect("/course/" + req.params.course)
})

router.get('/addpdf/:chaptre/:course', async (req, res) => {
  let chaptre = await Chaptre.findById(req.params['chaptre'])
  res.render('pdf', {chaptre: chaptre, course: req.params.course})
})

router.get('/addvid/:chaptre/:course', async (req, res) => {
  let chaptre = await Chaptre.findById(req.params['chaptre'])
  let user = await User.findById(req.session.user_id)
  res.render('vid', {chaptre: chaptre, course: req.params.course, user: user})
})
module.exports = router