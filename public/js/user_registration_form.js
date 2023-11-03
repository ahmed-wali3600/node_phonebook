'use strict'


const signup_btn=document.getElementById('i_signup_btn');


const signup_fname=document.getElementById('signup_fname');
const signup_lname=document.getElementById('signup_lname');
const signup_dob=document.getElementById('signup_dob');
const radio_male=document.getElementById('id_male');
const radio_female=document.getElementById('id_female');
const signup_email=document.getElementById('signup_email');
const signup_username=document.getElementById('signup_username');
const signup_password=document.getElementById('signup_password');

const signup_pic=document.getElementById('signup_pic');




const error_msg_fname=document.getElementById('error_msg_fname');
const error_msg_lname=document.getElementById('error_msg_lname');
const error_msg_dob=document.getElementById('error_msg_dob');
const error_msg_gender=document.getElementById('error_msg_gender');
const error_msg_pic=document.getElementById('error_msg_pic');
const error_msg_email=document.getElementById('error_msg_email');
const error_msg_username=document.getElementById('error_msg_username');
const error_msg_password=document.getElementById('error_msg_password');


const msg_box =bootstrap.Modal.getOrCreateInstance(document.getElementById('msg_box'));
const msg_box_btn=document.getElementById('msg_box_btn');

let field_valid=true;


signup_btn_functionality();
msg_box_btn_functionality();



function signup_btn_functionality(){

    signup_btn.addEventListener('click',function(){
        field_valid=true;
        let first_name=signup_fname.value;
        let last_name=signup_lname.value;

        let dob=signup_dob.value;
        let gender="Male";
        let email=signup_email.value;
        let username=signup_username.value;
        let password=signup_password.value;

        if(radio_male.checked){
            gender="Male";
        }
        else if(radio_female.checked){
            gender="Female";
        }


        is_field_empty(signup_fname,error_msg_fname,'First Name');
        is_field_empty(signup_lname,error_msg_lname,'Last Name');

        is_field_empty(signup_email,error_msg_email,'E-Mail');
        is_field_empty(signup_username,error_msg_username,'Username');
        is_field_empty(signup_password,error_msg_password,'Password');
        is_field_empty(signup_dob,error_msg_dob,'Date Of Birth');
        is_profile_image_selected(signup_pic,error_msg_pic,'Profile Picture');


        if(field_valid){

            const imageFile = signup_pic.files[0];

            const formData = new FormData();
            formData.append('user_first_name',first_name);
            formData.append('user_last_name',last_name);
            formData.append('user_dob',dob);
            formData.append('user_gender',gender);
            formData.append('user_email',email);
            formData.append('user_username',username);
            formData.append('user_password',password);
            formData.append('image', imageFile);


            const request_form_data_config={

                method:"POST",
                body:formData
            };


            send_form_data(request_form_data_config);

        }



    });
}



function set_field_error(error_field_id,has_error,error_msg=""){

    if(has_error){
        error_field_id.innerHTML=error_msg;
        error_field_id.classList.add('err_msg_enabled');
        error_field_id.classList.remove('err_msg_disabled');
    }
    else
    {
        error_field_id.classList.remove('err_msg_enabled');
        error_field_id.classList.add('err_msg_disabled');   
    }
}


async function send_form_data(form_data_config){

    let response_json = await fetch('http://127.0.0.1:5000/register',form_data_config);

    let response_obj = await response_json.json();


    if(response_obj.error_status){

        if(response_obj.error_type==1){
            set_field_error(error_msg_email,true,response_obj.error_msg);
        }

        if(response_obj.error_type==2){
            set_field_error(error_msg_username,true,response_obj.error_msg);
        }
    }
    else
    {
        set_field_error(error_msg_email,false);
        set_field_error(error_msg_username,false);
    }

    if(response_obj.success){
        msg_box.show();
    }

}


function is_field_empty(field_id,error_msg_id,field_title){

    let field_value=field_id.value;
    if(field_value==""){

        error_msg_id.innerHTML=`${field_title} Must not be empty`;
        error_msg_id.classList.add('err_msg_enabled');
        error_msg_id.classList.remove('err_msg_disabled');
        field_valid=false;
    }
    else
    {
        error_msg_id.classList.add('err_msg_disabled');
        error_msg_id.classList.remove('err_msg_enabled');
    }
}

function is_profile_image_selected(img_field_id,img_error_msg_id,img_field_title){

    if(img_field_id.files.length === 0)
    {
        img_error_msg_id.innerHTML=`Must Select ${img_field_title}`;
        img_error_msg_id.classList.add('err_msg_enabled');
        img_error_msg_id.classList.remove('err_msg_disabled');
        field_valid=false;
    }
    else{
        img_error_msg_id.classList.add('err_msg_disabled');
        img_error_msg_id.classList.remove('err_msg_enabled');
    }
}

function msg_box_btn_functionality(){
    msg_box_btn.addEventListener('click',function(){
        msg_box.hide();

        window.location.replace("/login");
        
    });
}