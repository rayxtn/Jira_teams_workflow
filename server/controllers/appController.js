import userModel from "../model/user.model.js"

// post : http://localhost:8080/api/register

export async function Register(req,res){
res.json('register route')
}

// post : http://localhost:8080/api/login

export async function login(req,res){
    res.json('login route')
    }

// get : http://localhost:8080/api/user/exampleofusername

export async function getUser(req,res){
    res.json('getUser route')
    }    

// put : http://localhost:8080/api/updateuser  
export async function updateUser(req,res){
        res.json('updateUser route')
        }   
        
// get : http://localhost:8080/api/generateOTP
export async function generateOTP(req,res){
    res.json('generateOTP route')
    }            

// get : http://localhost:8080/api/verifyOTP
export async function verifyOTP(req,res){
    res.json('verifyOTP route')
    } 

    //redirection when OTP is valid 
// get : http://localhost:8080/api/createResetSession
export async function createResetSession(req,res){
    res.json('createResetSession route')
    } 

// put : http://localhost:8080/api/resetPassword
export async function resetPassword(req,res){
    res.json('resetPassword route')
    }     