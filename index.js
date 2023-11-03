'use strict'

const express = require('express');
const app = express();
const router = require('./routes/route');
const cookieParser = require('cookie-parser');


app.set("view engine",'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(express.static('public'));







const port= process.env.port || 5000;

app.listen(port,'127.0.0.1',()=>{
    console.log("The Server is running at : http://127.0.0.1:"+port);
});