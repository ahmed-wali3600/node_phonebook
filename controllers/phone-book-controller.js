'use strict'

require('dotenv').config();
const phone_book_model=require("../models/phone-book-model");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const fs= require('fs/promises');
const crypto = require('crypto');
const { log } = require('console');


// const model_functions = require("../models/phone-book-model");
// const path = require('path');


class controller_functions{



    // async show_all_users(req,res){

    //     let query_result="variable test";
    //     query_result = await phone_book_model.get_all_users();
    
    //     let render_properties_values=
    //     {
    //         is_data_empty:(query_result.length>0),
    //         no_of_records:query_result.length,
    //         query_result:query_result,
    //         msg:"Welcome To Login Page",
    //         page_title:"Login Page",
    //         style_css:"css/login.css",
    //         script_name:"js/login.js"
    //     }
    
    //     res.render('login',render_properties_values);
    // }


    does_username_exists= async (user_username)=>{

        let result = await phone_book_model.does_username_exists(user_username);

        if(result.length>0){
            return true;
        }
        else
        {
            return false;
        }
    }


    does_email_exists=async (user_email)=>{

        let result = await phone_book_model.does_email_exists(user_email);

        if(result.length>0){
            return true;
        }
        else
        {
            return false;
        }

    }


    // direct_user_to_profile_page=(req,res)=>{
    //     console.log("Redirect 1");
    //     return res.status(302).redirect('/user-profile');

    // }



    register_new_user=async (req,res)=>{

        let email_exists = await this.does_email_exists(req.body.user_email);

        let username_exists= await this.does_username_exists(req.body.user_username);

        let response_data_obj={}

        if(email_exists){

            response_data_obj={
                error_status:true,
                error_type:1,
                error_msg:"E-Mail Already Exists"
            };

        }
        else if(username_exists){
            response_data_obj={
                error_status:true,
                error_type:2,
                error_msg:"Username Already Exists"
            };
        }
        else{

            let encoded_password= await bcrypt.hash(req.body.user_password,10);

            let dir_name=`./public/user_img_uploads/${req.body.user_first_name}${Date.now()}/`;
            await fs.mkdir(dir_name,{ recursive: true });

            const image_data=req.file;
            // console.log(req.file.buffer);

            const image_name=`${Date.now()}-${image_data.originalname}`;
            const destinationPath =`${dir_name}${image_name}`;

             await fs.writeFile(destinationPath,image_data.buffer );




//username, user_password, user_email, user_fname, user_lname, user_activate, user_gender, user_dob, user_age
             let profile_created= await phone_book_model.insert_new_user(req.body.user_username,encoded_password,req.body.user_email,req.body.user_first_name,req.body.user_last_name,1,this.parse_gender(req.body.user_gender),req.body.user_dob,this.calculateAge(req.body.user_dob));

             if(profile_created){
                let is_img_uploaded = await phone_book_model.insert_profile_img(destinationPath,req.body.user_username,image_name,1);

                if(is_img_uploaded){

                    response_data_obj={
                        error_status:false,
                        error_type:0,
                        error_msg:"",
                        success:true,
                        success_msg:"Account Created Successfully"
                    };

                }
             }

        }


        res.json(response_data_obj);

        return;
    }




    calculateAge(dateOfBirth) {
        // Parse the date of birth string to a Date object
        const dob = new Date(dateOfBirth);
    
        // Get the current date
        const currentDate = new Date();
    
        // Calculate the difference in years
        const age = currentDate.getFullYear() - dob.getFullYear();
    
        // Check if the birthday for this year has already occurred
        if (
            currentDate.getMonth() < dob.getMonth() ||
            (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())
        ) {
            // If not, subtract 1 from the age
            return age - 1;
        }
    
        return age;
    }
    

    




    parse_gender=(gender)=>{
        if(gender==="Male"){
            return 1;
        }
        else{
            return 0;
        }
    }

    show_login_page=(req,res)=>{

        let render_properties_values=
        {
            msg:"Welcome To Login Page",
            page_title:"Login Page",
            style_css:"css/login.css",
            script_name:"js/login.js"
        }
    
        res.render('login',render_properties_values);
    }



    get_password= async (username)=>{

        const password_result = await phone_book_model.get_password(username);

        return password_result;
    }


    async comparePasswords(userProvidedPassword, hashedPasswordFromDatabase) {
        try {
            const result = await new Promise((resolve, reject) => {
                bcrypt.compare(userProvidedPassword, hashedPasswordFromDatabase, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
    
            return result; // Returns true if passwords match, false if they don't
        } catch (error) {
            // Handle the error, e.g., log it or return an error status
            return false; // Return false for any error
        }
    }



     login_user= async (req,res)=>{

        const username=req.body.username;
        const password=req.body.password;

        let result_obj={};
        // console.log(`Log 1 : ${username} -- ${password}`);

        let username_existance = await this.does_username_exists(username);

        if(username_existance){

            let hased_db_pass= await this.get_password(username);
            let password_verification = await this.comparePasswords(password,hased_db_pass[0].user_password);
            
            if(password_verification){

                let user_id=hased_db_pass[0].user_id;
                const payload = { user_id: user_id };
                const secretKey=process.env.JWT_TOKEN_KEY;
                const token = jwt.sign(payload, secretKey);
                // res.header('Authorization', `Bearer ${token}`);
                result_obj={

                    error_status:false,
                    error_type:0,
                    error_msg:"",
                    success_status:true,
                    success_msg:"Login Successfull",
                    en_key:process.env.ENCRYPT_KEY
                };
                res.cookie('authorization',`Bearer ${token}`);
            }
            else
            {
                result_obj={
                    error_status:true,
                    error_type:2,
                    error_msg:"Password Incorrect",
                    success_status:false,
                    success_msg:""
                };
            }
        }
        else
        {
            result_obj={

                error_status:true,
                error_type:1,
                error_msg:"Incorrect Username",
                success_status:false,
                success_msg:""
            };
        }


        res.json(result_obj);

        return;
     }


     load_contects_page= async (req,res)=>{

        let user_profile_data=await this.set_payload_data(req);

        let user_contacts = await phone_book_model.get_user_contacts(user_profile_data.user_id);

        console.log('User id : '+user_profile_data.user_id);
        // console.log("some data "+user_contacts[0]['Contact_Name']);
        let render_properties_values=
        {
            msg:`The id ${user_profile_data.user_id}`,
            page_title:`${user_profile_data.user_fname} ${user_profile_data.user_lname} Contacts`,
            user_contacts:user_contacts,
            style_css:"css/user_contacts.css",
            script_name:"js/user_contacts.js"
        }
    
        res.render('user_contacts',render_properties_values);
     }

   

     async set_payload_data(req){
        let user_id = req.token_payload.user_id;

        let [user_profile_data] = await phone_book_model.get_user_profile_data(user_id);
 
     //    console.log(user_profile_data.user_fname);
 
         user_profile_data.image_path=user_profile_data.image_path.replace('./public',"");
 
         user_profile_data.user_gender=this.get_gender(user_profile_data.user_gender);
         user_profile_data.user_dob=this.set_dob(user_profile_data.user_dob);

         return user_profile_data;
     }
      

    show_user_profile_page = async (req,res)=>{

       
        let user_profile_data=await this.set_payload_data(req);
        // console.log("Img "+user_profile_data.image_path);
       let render_properties_values=
       {
           msg:"Welcome To Login Page",
           user_profile_data:user_profile_data,
           page_title:`${user_profile_data.user_fname} ${user_profile_data.user_lname} Profile`,
           style_css:"css/user_profile_page.css",
           script_name:null
       }

       res.render('user_profile_page',render_properties_values)


    }


    set_dob(dateString){
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return formattedDate;
    }

    get_gender(gen) {
        if(gen==1){
            return "Male";
        }
        else
        {
            return "Female";
        }
    }

    async verifyToken(token, secret) {
        try {
          const decoded = await jwt.verify(token, secret);
          return decoded;
        } catch (error) {
          throw error;
        }
      }

    valid_token_string(token_string){

        return token_string.includes("Bearer");
    }


    user_registeration_form=(req,res)=>{

        //E:\node\pro3\phone-book\views\user_registration_form.ejs
        let render_properties_values=
        {
            msg:"Welcome To Login Page",
            page_title:"Register User",
            style_css:"css/user_registration_form.css",
            script_name:"js/user_registration_form.js"
        }

        res.render('user_registration_form',render_properties_values);
    }

}




module.exports=new controller_functions();