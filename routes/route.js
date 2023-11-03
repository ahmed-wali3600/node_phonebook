'use strict'

const express = require('express');
const router = express.Router();
const multer=require('multer');
const phone_book_controller= require('../controllers/phone-book-controller');
const phone_book_middlewares=require('../middlewares/phone_book_middlewares');


const storage = multer.memoryStorage(); // This stores the file in memory
const upload = multer({ storage: storage });



router.get('/',phone_book_controller.show_login_page);

router.get('/login',phone_book_controller.show_login_page);

router.get('/register',phone_book_controller.user_registeration_form)

// router.post('/test',(req,res)=>{

//     let username = req.params.username;
//     let password = req.params.password;
//     res.json({
//         username:username,
//         password:password
//     });
// });



router.post('/register',upload.single('image'),phone_book_controller.register_new_user);

router.post('/login',phone_book_controller.login_user);

// router.get('/user-profile',phone_book_middlewares.verifyToken,(req,res)=>{

//     console.log("user profile 1");
//     phone_book_controller.show_user_profile_page(req,res);
// });

// router.get('/user-profile',phone_book_middlewares.verifyToken,phone_book_controller.show_login_page);
router.get('/user-profile',phone_book_middlewares.auth,phone_book_controller.show_user_profile_page);

router.get('/user-contacts',phone_book_middlewares.auth,phone_book_controller.load_contects_page);
// router.get('/redirect-to-profile',phone_book_middlewares.verifyToken,phone_book_controller.direct_user_to_profile_page);



// router.get('/',phone_book_controller.show_all_users(req,res));

module.exports=router;