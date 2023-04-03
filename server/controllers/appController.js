import userModel from "../model/user.model.js"
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import bcrypt from 'bcrypt';
import Auth from "../middleware/auth.js";
import ENV from '../config.js'
import crypto from 'crypto';

const tokenKey = crypto.randomBytes(64).toString('base64');
console.log(tokenKey);
// post : http://localhost:8080/api/register
/*
{
    'username': 'admin',
    'password': 'testpassword', 
    'email': 'testemail@gmail.com',
    'profile': '',    
}
*/


//GET ALL ISSUES FROM THE PROJECT 

// DEFINE THE PROJECT ID BEFORE POSTING
export async function getallIssues(){
    try{
        const jiraApiUrl = `https://avaxia.atlassian.net/rest/api/3/search?jql=project=DIN&maxResults=1000`
        const authHeader = `Basic ${Buffer.from('raed.houimli@avaxia-group.com:ATATT3xFfGF0EdvwZaF2Ggci4SfG-E6ZwEDHmJWctz0eT7S0bsX4mX5IJEnwESfbRUs6Y-tBwc-sr4Xg1fpkJELz3iCQ-NNNbp5qPnoZF39j6zQmD_SOxjI8-8FJGfpbBeHJf_bV2sgVcpJBMYKPRaOc0iIfk5bKVx1EkCUcn_Sem7ipzzqCnCE=D3C47169').toString('base64')}`          
        const myProjectIssues = await fetch(jiraApiUrl , {headers: { 'Authorization': authHeader, 'Accept': 'application/json' }})
        const response = await myProjectIssues.json();
         const allIssues = response;
           console.log(allIssues.total);
           const issuesData = allIssues.issues;
            for (let i =0; i < issuesData.length;i++) {
            console.log(issuesData[i]['id']); }

                            }catch{
        console.log(error);
    }
    
    }

//GET WORKLOGS

export async function getWorklogs(){

try{
    const jiraApiUrl = `https://avaxia.atlassian.net/rest/api/3/issue/DIN-25/worklog`
    const authHeader = `Basic ${Buffer.from('raed.houimli@avaxia-group.com:ATATT3xFfGF0EdvwZaF2Ggci4SfG-E6ZwEDHmJWctz0eT7S0bsX4mX5IJEnwESfbRUs6Y-tBwc-sr4Xg1fpkJELz3iCQ-NNNbp5qPnoZF39j6zQmD_SOxjI8-8FJGfpbBeHJf_bV2sgVcpJBMYKPRaOc0iIfk5bKVx1EkCUcn_Sem7ipzzqCnCE=D3C47169').toString('base64')}`          
    const myworklogs = await fetch(jiraApiUrl , {headers: { 'Authorization': authHeader, 'Accept': 'application/json' }})
    const response = await myworklogs.json();
  
     const Worklogs = response.worklogs;
    // console.log(Worklogs);
      //  console.log(response.startAt);
       // console.log(response.maxResults)
       // console.log(response.total)
        for (let i =0; i < Worklogs.length;i++) {
        console.log(Worklogs[i]['issueId']);
        console.log(Worklogs[i]['created']);
        console.log(Worklogs[i]['updated']);
        console.log(Worklogs[i]['started']);
        console.log(Worklogs[i]['timeSpent']);
        console.log(Worklogs[i]['author']);
    }
      


              



           /*   const worklogsData = response.worklogs.map(item => ({
                id: item.id,
                author: item.author,
                description: item.comment,
                timeSpent: item.timeSpentSeconds
              }));
            */
            }
catch{
    console.log(error);
}

}




/** middleware for verify user */
export async function verifyUser(req, res, next){
  try {
      
      const { username } = req.method == "GET" ? req.query : req.body;

      // check the user existance
      let exist = await userModel.findOne({ username });
      if(!exist) return res.status(404).send({ error : "Can't find User!"});
      next();

  } catch (error) {
      return res.status(404).send({ error: "Authentication Error"});
  }
}

export async function Register(req,res){
  try {
    const {username,password,email,profile} = req.body;
    console.log("test");
    console.log(req.body);

    //check the existing of user
    const existUsername = new Promise((resolve, reject) => {
        userModel.findOne({ username }).then( (err, user) => {
          if (err) { reject(new Error(err)); } 
          else if (user) { reject({ error: "please use a unique username" });} 
          else { resolve();}
        });
      });

      //check the existing of Email
      const existEmail = new Promise((resolve, reject) => {
        userModel.findOne({ email }).then( (err, email) => {
          if (err) { reject(new Error(err)); } 
          else if (email) { reject({ error: "please use a unique email" });} 
          else { resolve();}
        });
      });

     Promise.all([existUsername,existEmail]).then(()=>{
        if(password){
            bcrypt.hash(password,10)
            .then(hashedPassword=>{
                const user = new userModel({
                    username,
                    password : hashedPassword,
                    profile : profile || '',
                    email:email,
                });
                // return and save the result 
                user.save()
                .then(result => res.status(201).send({ msg: "User Register Successfully"}))
                .catch(error =>{res.status(500).send({ error})
            })
            }).catch((error)=>{return res.status(500).send({error : "Enable to hash password"})})
        }
    }).catch((error)=>{return res.status(500).send({error})})


}catch (error) {
    return res.status(500).error;
  }
}

// post : http://localhost:8080/api/login

export async function login(req,res){
    const { username, password } = req.body;

    try {
        
        userModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

                        // CREATING A JWT TOKEN
                        const token = jwt.sign({
                            userId:user._id,
                            username:user.username,
                        },ENV.JWT_SECRET,{expiresIn:"24h"});
                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });                                    

                    })
                    .catch(error =>{
                        return res.status(400).send({ error: "Password does not Match"})
                    })
            })
            .catch( error => {
                return res.status(404).send({ error : "Username not Found"});
            })

    } catch (error) {
        return res.status(500).send({ error});
    }
}


    
  

// get : http://localhost:8080/api/user/exampleofusername

    export async function getUser(req, res) {
        const { username } = req.params;
      
        try {
          if (!username) {
            return res.status(501).send({ error: "Invalid Username" });
          }
      
          const user = await userModel.findOne({ username });
      
          if (!user) {
            return res.status(501).send({ error: "Couldn't Find the User" });
          }
      
          /** remove password from user */
          // mongoose return unnecessary data with object so convert it into json
          const { password, ...rest } = Object.assign({}, user.toJSON());
      
          return res.status(201).send(rest);
        } catch (error) {
          console.error(error);
          return res.status(500).send({ error: "Internal Server Error" });
        }
      }
/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateuser(req,res){
    try {
        
        // const id = req.query.id;
        const { userId } = req.user;

        if(userId){
            const body = req.body;

            // update the data
            userModel.updateOne({ _id : userId }, body, function(err, data){
                if(err) throw err;

                return res.status(201).send({ msg : "Record Updated...!"});
            })

        }else{
            return res.status(401).send({ error : "User Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
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

   