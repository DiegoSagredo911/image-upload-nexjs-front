require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path')
app.use(express.json({limit: '50mb'}));
app.use(cors({origin: process.env.originCros, credentials:true}))
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(require('./router/index'));
app.listen(process.env.port);
app.use(express.static( path.resolve( __dirname, './public' )));
console.log("Api en puerto: "+process.env.port);