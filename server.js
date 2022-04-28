const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path')
require('dotenv').config();

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null, file.originalname + '--' + Date.now() + path.extname(file.originalname));
  }
});

// const upload = multer({
//   storage: storage,
//   limits: {fileSize: 1000000}
// });

const upload = multer({
  storage: storage,
  limits: {fileSize: 1000000}
}).single('upfile');

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
//   if(!req.file){
//     return res.json({error: "No file selected"});
//   }
//   const response = {
//     name: req.file.originalname,
//     type: req.file.mimetype,
//     size: req.file.size
//   }
//   res.json(response);
// });
app.post('/api/fileanalyse', (req, res) => {
  upload(req, res, (err) => {

    if(err) {
      console.log(err);
      return res.json({error: err.message});
    }
    if(!req.file) {
      return res.json({error: "No file selected"});
    }
    const response = {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    }
    res.json(response);
  });
});




const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

/* =============OPTION 1================
1. DEFINE upload = multer({...}).single('upfile');
2. PLACE THIS INSIDE (req, res) => {} from app.post
upload(req, res, (err) => {

  //do the error handling
  //and res.json
  //and other stuffs here
  if(err) {
    return res.json({error: err.message});
  } else {
    if(!req.file) {
      return res.json({error: "No file selected"});
    } else {
      const response = {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size
      }
      res.json(response);
    }
  }
});
//despicable, but robust
*/
/*
================OPTION 2==================
1. DEFINE upload = multer({...});
2. IMPLEMENT THE ROUTE AS FOLLOWS:
    app.post('/whatever', upload.single('upfile'), (req, res) => {
      //stuff goes here
      //this one looks more beautiful, but it be less robust
      //can't do much error handling
    })
*/
