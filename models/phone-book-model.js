const db = require('../config/db_config');


async function get_all_users(){


    try {
        const [rows] = await db.query('SELECT * FROM user_profile');
        return rows; 
    } catch (err) {
        // query_result = err;
        throw err; 
    }

}


async function insert_new_user( username, user_password, user_email, user_fname, user_lname, user_activate, user_gender, user_dob, user_age){

    try {

        const query = 'INSERT INTO user_profile (username, user_password, user_email, user_fname, user_lname, user_activate, user_gender, user_dob, user_age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [username, user_password, user_email, user_fname, user_lname, user_activate, user_gender, user_dob, user_age];

        console.log(values);

        await db.query(query, values);

        return true;

    } catch (err) {
        console.log(err);
        throw err; 
        
    }

}


async function get_user_profile_data(user_id){

    try {
        const [rows] = await db.query(`
        SELECT  up.user_id,
                up.username,  
                up.user_email, 
                up.user_fname, 
                up.user_lname, 
                up.user_gender, 
                up.user_dob, 
                up.user_age,
                ui.image_path
        FROM user_profile up
        join user_images ui
        on up.user_id=ui.user_id 
        where up.user_id=${user_id}`);
        return rows; 
    } catch (err) {
        // query_result = err;
        throw err; 
    }
}

async function does_email_exists(user_email){
    try {
        const [rows] = await db.query(`SELECT * FROM user_profile where user_email='${user_email}'`);
        return rows; 
    } catch (err) {
        // query_result = err;
        throw err; 
    }
}


async function get_user_contacts(user_id){
    try {
        const [rows] = await db.query(`SELECT cd.contact_name AS Contact_Name,
                                              cd.contact_id AS Contact_Id,   
                                              cn.contact_number_id AS Contact_Number_Id, 
                                              cn.contact_number AS Contact_Number 
                                        FROM user_profile up
                                        LEFT JOIN contact_details cd ON up.user_id = cd.user_id
                                        LEFT JOIN contact_numbers cn ON cd.contact_id = cn.contact_id
                                        WHERE up.user_id = ${user_id}
                                        ORDER BY cd.contact_name ASC;`);
        return rows; 
    } catch (err) {
        // query_result = err;
        throw err; 
    }
}


async function get_user_id_by_username(username){

    try {
        const [rows] = await db.query(`SELECT user_id FROM user_profile where username='${username}'`);
        return rows[0].user_id; 
    } catch (err) {
        // query_result = err;
        throw err; 
    }
}



async function get_password(username){

    try {
        const [rows] = await db.query(`SELECT user_password,user_id FROM user_profile where username='${username}'`);
        return rows; 
    } catch (err) {
        // query_result = err;
        throw err; 
    }

}

async function insert_profile_img(profile_img_url,username,image_name,image_active)
{

    let user_id= await get_user_id_by_username(username);

    try {

        const query = 'INSERT INTO user_images (user_id, image_path, image_name, image_activate) VALUES (?, ?, ?, ?)';
        const values = [user_id,profile_img_url,image_name,image_active];

        await db.query(query, values);

        return true;

    } catch (err) {
        throw err; 
    }

}

async function does_username_exists(user_username){

    try {
        const [rows] = await db.query(`SELECT * FROM user_profile where username='${user_username}'`);
        return rows; 
    } catch (err) {
        // query_result = err;
        throw err; 
    }
}


const model_functions={
        get_all_users,
        does_email_exists,
        does_username_exists,
        insert_profile_img,
        insert_new_user,
        get_password,
        get_user_profile_data,
        get_user_contacts  
};

module.exports=model_functions;