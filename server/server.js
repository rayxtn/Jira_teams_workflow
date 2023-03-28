// WE CONNOT USE IMPORT IN THE BACKEND TO CREATE A SERVER INSTEAD WE USE CONST = REQUIRE
import  express  from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/connection.js";
//const express = require("express");


const app = express();
//middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); //disable the use of x-powered-by for security purposes

//port number for server connections
const port=8080;

//http get request
app.get('/', (req,res) => {
    res.status(201).json("HOME get request");
});
// starting the server only when we have valid connection
connect().then( () =>{
    try {
        app.listen(port,()=>{
            console.log("APP LISTENING ON PORT"+port)
        });      
    } catch (error) {
        console.log("connection failed");
    }
}).catch(error => {console.log("Invalid database connection");
});






