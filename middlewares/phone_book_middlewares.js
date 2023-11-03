
const jwt= require('jsonwebtoken');
require('dotenv').config();
const secretKey=process.env.JWT_TOKEN_KEY;


class phone_book_middlewares{

     auth=(req, res, next)=> {
          let jwt_token = req.cookies['authorization'];

          let secretKey = process.env.JWT_TOKEN_KEY;
          if (!jwt_token) {
              console.log('Token is undefined '+jwt_token);
              return res.redirect('/login');
          }

          jwt_token = jwt_token.split(' ')[1];
          console.log(jwt_token);
          // console.log('Middleware 1');
          
      
        
          jwt.verify(jwt_token, secretKey, (err, decoded) => {
            if (err) {
              console.log('Error : Token not Verified ' +err);
              return res.redirect('/login');
            }
            else
            {
              // console.log(decoded.user_id);
              console.log('User Payload set');
              req.token_payload=decoded;
              next();
            }
        

          //    next();
          });
      }
      
}


module.exports=new phone_book_middlewares();