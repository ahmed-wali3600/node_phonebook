'use strict'




const signin_btn=document.getElementById('signin_btn');
const username_field=document.getElementById('id_username_field');
const password_field=document.getElementById('id_password_field');

const err_username_field=document.getElementById('err_username_field');
const err_password_field=document.getElementById('err_password_field');

let field_valid=true;


signin_btn_functionality();


function signin_btn_functionality(){


    signin_btn.addEventListener('click',function(event){


        const username=username_field.value;
        const password=password_field.value;

        is_field_empty(username_field,err_username_field,"Username");
        is_field_empty(password_field,err_password_field,"Password");
        

        if(field_valid){

            const login_request_data={
                username:username,
                password:password
            };
    
            const request_config={
    
                method:"POST",
                body:JSON.stringify(login_request_data),
                headers:{
                    'Content-Type':"application/json"
                }
            };
    
            send_login_data(request_config);
    

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

async function send_login_data(request_config){


    const login_response = await fetch('http://127.0.0.1:5000/login',request_config);
    const login_response_json= await login_response.json();



    if(login_response_json.error_status){
        if(error_type==1){
            set_field_error(err_username_field,true,login_response_json.error_msg);
        }
        else if(error_type==2){
            set_field_error(err_password_field,true,login_response_json.error_msg);
        }
    }
    else
    {
        set_field_error(err_username_field,false);
        set_field_error(err_password_field,false);
    }


    if(login_response_json.success_status){

        // const login_response_token = extractTokenFromHeader(login_response);

        // const en_key = login_response_json.en_key;
        // setSessionCookie('jwt_token',login_response_token);

   
        // const url_token=`Bearer ${getJWTTokenFromCookie()}`;

        // console.log(en_key);

        // let url_encypted_token = customEncrypt(url_token,en_key);
        // // alert(temp_text);
        // let url_encoded_token =encodeURIComponent(url_encypted_token);
        // console.log("Encrypted : "+url_encypted_token);
        // console.log("Encoded : "+url_encoded_token);

        // alert(getJWTTokenFromCookie());
        window.location.replace(`/user-profile`);
   
    }


}





function customEncrypt(plainText, key) {
    let cipherText = '';
    for (let i = 0; i < plainText.length; i++) {
      const charCode = plainText.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      const encryptedCharCode = charCode ^ keyChar;
      cipherText += String.fromCharCode(encryptedCharCode);
    }
    return cipherText;
  }
  
  function customDecrypt(cipherText, key) {
    let plainText = '';
    for (let i = 0; i < cipherText.length; i++) {
      const charCode = cipherText.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      const decryptedCharCode = charCode ^ keyChar;
      plainText += String.fromCharCode(decryptedCharCode);
    }
    return plainText;
  }



function getJWTTokenFromCookie() {
    const name = 'authorization=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }
  



function setSessionCookie(name, value) {
    document.cookie = `${name}=${value}; path=/`;
}

function extractTokenFromHeader(response) {
    const authHeader = response.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7); // Remove "Bearer " from the header value
    }
    return null;
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
