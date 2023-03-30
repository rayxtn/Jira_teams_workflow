import userModel from "../model/user.model.js"
import bcrypt from 'bcrypt';
// post : http://localhost:8080/api/register
/*
{
    'username': 'admin',
    'password': 'testpassword', 
    'email': 'testemail@gmail.com',
    'profile': '',
    
}

*/

export async function Register(req,res){
  try {
    const {Username,password,profile,email} = req.body; 

    //check the existing of user
    const existUsername = new Promise((resolve, reject) => {
        userModel.findOne({ Username }, (err, user) => {
          if (err) {
            reject(new Error(err));
          } else if (user) {
            reject({ error: "please use a unique username" });
          } else {
            resolve();
          }
        });
      });

      //check the existing of Email
    const existEmail = new Promise((resolve, reject) => {
        userModel.findOne({ email }, (err, user) => {
          if (err) {
            reject(new Error(err));
          } else if (user) {
            reject({ error: "please use a unique Email" });
          } else {
            resolve();
          }
        });
      });

      Promise.all([existUsername,existEmail]).then(()=>{
        if(password){
            bcrypt.hash(password,10)
            .then(hashedPassword=>{
                const user = new userModel({
                    Username,
                    password : hashedPassword,
                    profile : profile || '',
                    email:email,
                });
                // return and save the result 
                user.save()
                .then(result=>{res.status(201).send({msg :'user registred successfully'})})
                .catch(result =>{res.status(500).send({ error})
            })
            }).catch((error)=>{return res.status(500).send({error : "Enable to hash password"})})
        }
    }).catch((error)=>{return res.status(500).send({error})})

  } catch (error) {
    return res.status(500).error;
  }
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