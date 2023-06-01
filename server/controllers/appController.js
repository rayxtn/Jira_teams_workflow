import UserModel from '../model/User.model.js';
import Shift from '../model/Shift.model.js'; // Import the Shift model or define it within the same file
import bcrypt from 'bcrypt';
import weekdata from '../model/weekdata.model.js'
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import JIRA_TOKEN from '../config.js';
import otpGenerator from 'otp-generator';
import fetch from 'node-fetch';
import msal from '@azure/msal-node';
import axios from 'axios';
import { Client } from '@microsoft/microsoft-graph-client';
import qs from 'qs';
import mongoose from 'mongoose';
import moment from "moment";



export async function fetchworklogs(req, res) {
  try {
    // Retrieve all documents from the 'assignees' collection
    const assignees = await Assignee.find();

    // Filter the worklogs for the current week (Monday to Friday)
    const currentWeekStart = moment().startOf('week'); // Get the start of the current week
    const currentWeekEnd = moment().endOf('week'); // Get the end of the current week

    const filteredAssignees = assignees.map((assignee) => {
      const filteredIssues = assignee.issues.reduce((filtered, issue) => {
        const filteredWorklogs = issue.worklogs.filter((worklog) => {
          const createdDate = moment(worklog.created);
          return createdDate.isBetween(currentWeekStart, currentWeekEnd, 'day', '[]');
        });

        if (filteredWorklogs.length > 0) {
          filtered.push({ ...issue, worklogs: filteredWorklogs });
        }

        return filtered;
      }, []);

      if (filteredIssues.length > 0) {
        return {
          assigneeName: assignee.assigneeName,
          assigneeEmail: assignee.assigneeEmail,
          issues: filteredIssues,
        };
      } else {
        return null;
      }
    }).filter(Boolean);

    // Save the filtered data into the 'weeksdata' collection
    const weekData = {
      week: `week_${currentWeekStart.format('YYYY-MM-DD')}`,
      data: filteredAssignees,
    };

    await weekdata.create(weekData);

    // Send the filtered data as JSON response
    res.json(filteredAssignees);
  } catch (error) {
    console.error('Error retrieving data:', error);
    // Send an error response if needed
    res.status(500).json({ error: 'Internal server error' });
  }
}







/*export async function fetchworklogs(req, res) {
  try {
    // Retrieve all documents from the 'assignees' collection
    const assignees = await Assignee.find();

    // Filter the worklogs for the current week (Monday to Friday)
    const currentWeekStart = moment().startOf('week'); // Get the start of the current week
    const currentWeekEnd = moment().endOf('week'); // Get the end of the current week

    const filteredAssignees = assignees.map((assignee) => {
      const filteredIssues = assignee.issues.reduce((filtered, issue) => {
        const filteredWorklogs = issue.worklogs.filter((worklog) => {
          const createdDate = moment(worklog.created);
          return createdDate.isBetween(currentWeekStart, currentWeekEnd, 'day', '[]');
        });

        if (filteredWorklogs.length > 0) {
          filtered.push({ ...issue, worklogs: filteredWorklogs });
        }

        return filtered;
      }, []);

      if (filteredIssues.length > 0) {
        return {
          assigneeName: assignee.assigneeName,
          assigneeEmail: assignee.assigneeEmail,
          issues: filteredIssues,
        };
      } else {
        return null;
      }
    }).filter(Boolean);

    // Send the filtered data as JSON response
    res.json(filteredAssignees);
  } catch (error) {
    console.error('Error retrieving data:', error);
    // Send an error response if needed
    res.status(500).json({ error: 'Internal server error' });
  }
}

*/


// Define a schema for the collection
export const assigneeSchema = new mongoose.Schema({
    assigneeEmail: String,
    assigneeName: String,
    issues: [{
      issueId: String,
      issueKey: String,
      summary: String,
      worklogs: [{ /* Define the worklogs schema if needed */ }],
    }],
  });
  
  // Create a model for the collection
  //const Assignee = mongoose.model('Assignee', assigneeSchema);
  
  
  // Create a model for the collection
  const Assignee = mongoose.model('Assignee', assigneeSchema);


  export async function getIssues(req, res) {
    try {
      const jiraApiUrl = `https://avaxia.atlassian.net/rest/api/3/search?jql=project=DIN&maxResults=1000`;
      const authHeader = `Basic ${Buffer.from('raed.houimli@avaxia-group.com:ATATT3xFfGF00YV_MQIjYKEHqKYBJzDBPKb1US9miwCek5YrufLycXMjhrQgsHKC4contO9r4WBf-fKGurcZ3rjgszYxbyG2l8QSKgEj1ixrDyR2B4yyv2r2RnQpoMpGt44LacMkr3MGzxAnIXxuiKt1PB2gAKDgOqH7365nzAga2dID-_LC4Q4=01FC55E8').toString('base64')}`;
  
      const response = await fetch(jiraApiUrl, { method: 'GET', headers: { 'Authorization': authHeader, 'Accept': 'application/json' } });
      const issuesData = await response.json();
      const issues = issuesData.issues;
  
      const assigneeIssues = {};
  
      for (const issue of issues) {
        const issueId = issue.id;
        const assignee = issue.fields.assignee;
        const assigneeEmail = assignee ? assignee.emailAddress : 'Unassigned';
        const assigneeName = assignee ? assignee.displayName : 'Unassigned';
  
        // Retrieve worklogs for each issue
        const worklogsUrl = 'https://avaxia.atlassian.net/rest/api/3/issue/' + issueId + '/worklog';
        const worklogsResponse = await fetch(worklogsUrl, { method: 'GET', headers: { 'Authorization': authHeader, 'Accept': 'application/json' } });
        const worklogsData = await worklogsResponse.json();
        const worklogs = worklogsData.worklogs;
  
        // Group issues and worklogs by assignee email
        if (!assigneeIssues[assigneeEmail]) {
          assigneeIssues[assigneeEmail] = {
            assigneeName,
            issues: [],
          };
        }
  
        assigneeIssues[assigneeEmail].issues.push({
          issueId,
          issueKey: issue.key,
          summary: issue.fields.summary,
          worklogs,
        });
      }
  
      console.log(assigneeIssues);
  
      // Clear existing data in the MongoDB collection
      await Assignee.deleteMany({});
  
      // Save data to MongoDB collection
      const savedAssignees = await Assignee.create(Object.entries(assigneeIssues).map(([assigneeEmail, assigneeData]) => ({
        assigneeEmail,
        assigneeName: assigneeData.assigneeName,
        issues: assigneeData.issues,
      })));
  
      console.log('Data saved to MongoDB:', savedAssignees);
  
      const assigneeIssuesJSON = JSON.stringify(assigneeIssues);
      return res.send(assigneeIssuesJSON);
    } catch (error) {
      console.log('FAILED TO CONNECT!', error);
      // Handle the error and send an appropriate response
      return res.status(500).send('Failed to fetch and save issues.');
    }
  }
  
  async function getAllAssignees(req, res) {
    try {
      const assignees = await Assignee.find();
      res.send(assignees);
    } catch (error) {
      console.log('Failed to retrieve data from MongoDB:', error);
      res.status(500).send('Failed to retrieve data.');
    }
  }
  
  
  
  
  

  
 




  



  
  export async function connectMS(request, response) {
    try {
      // Set your app credentials and desired permissions
      let data = qs.stringify({
        'grant_type': 'client_credentials',
        'client_id': 'd9452d4b-7b90-49cb-96a9-dbd03bbbc1ec',
        'state': '12345',
        'scope': 'https://graph.microsoft.com/.default',
        'client_secret': 'uo6k~B1F.2_yA~O5Mqf5rLMCP0KgXS14_Y',
        '': ''
      });
  
      let tokenConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://login.microsoftonline.com/7ecf1dcb-eca3-4727-8201-49cf4c94b669/oauth2/v2.0/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
      };
  
      const tokenResponse = await axios.request(tokenConfig);
      const accessToken = tokenResponse.data.access_token;
  
      let shiftsConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://graph.microsoft.com/v1.0/teams/d9f935aa-0d31-403d-9d4f-33728253b85a/schedule/shifts',
        headers: {
          'MS-APP-ACTS-AS': 'nassim.jloud@avaxia-group.com',
          'Authorization': 'Bearer ' + accessToken
        }
      };
  
      const shiftsResponse = await axios.request(shiftsConfig);
      const shiftsData = shiftsResponse.data;
  
      if (shiftsData && shiftsData.value && Array.isArray(shiftsData.value)) {
        // Delete existing shifts from the database
        await Shift.deleteMany({});
  
        // Process and save the new shifts data to the database
        const shiftPromises = shiftsData.value.map(async (shiftData) => {
          const shift = new Shift({
            id: shiftData.id,
            displayName: shiftData.displayName,
            startDateTime: shiftData.startDateTime,
            endDateTime: shiftData.endDateTime,
            createdDateTime: shiftData.createdDateTime,
            lastModifiedDateTime: shiftData.lastModifiedDateTime,
            userId: shiftData.userId,
            userDisplayName: shiftData.userDisplayName,
            userEmailAddress: shiftData.userEmailAddress,
            userRole: shiftData.userRole,
            teamId: shiftData.teamId,
            teamDisplayName: shiftData.teamDisplayName,
            teamMemberCount: shiftData.teamMemberCount
          });
  
          try {
            const savedShift = await shift.save();
            console.log('Shift saved:', savedShift);
            return shift;
          } catch (error) {
            console.log('Failed to save shift:', error);
            throw error; // Propagate the error to be caught later
          }
        });
  
        // Wait for all shift promises to resolve
        const savedShifts = await Promise.all(shiftPromises);
  
        response.json({ shifts: savedShifts });
      } else {
        throw new Error('Invalid shifts data received');
      }
    } catch (error) {
      console.log(error);
      response.status(500).send('Failed to fetch and save data.');
    }
  }
  
  

//GET WORKLOGS

export async function worklogs(){
    try{
       let issues = await getIssues();
       console.log(issues);
       
     // const jiraApiUrl = `https://avaxia.atlassian.net/rest/api/3/issue/DIN-25/worklog`
     // const authHeader = `Basic ${Buffer.from(JIRA_TOKEN).toString('base64')}`          
      //const myworklogs = await fetch(jiraApiUrl , {method:'GET',headers: { 'Authorization': authHeader, 'Accept': 'application/json' }})
      //const response = await myworklogs.json();
       
       //const Worklogs = response.worklogs;

          // console.log(Worklogs);
         // console.log(response.total)
           /*   const worklogsData = response.worklogs.map(item => ({
                  id: item.id,
                  author: item.author,
                  description: item.comment,
                  timeSpent: item.timeSpentSeconds
                }));
              */
         // for (let i =0; i < Worklogs.length;i++) {
          //console.log(Worklogs[i]['issueId']);
         /* const Worklogs = new worklogsModel({
              issueId :Worklogs[i]['issueId'],
              created :Worklogs[i]['issueId'],
              updated :Worklogs[i]['updated'],
              started :Worklogs[i]['started'],
              timeSpent :Worklogs[i]['timeSpent'],
              accountId :Worklogs[i]['author']['accountId'],
          });
          try{
            Worklogs.save();
          }catch(err){
              console.log(err);
          }*/
         /* console.log(Worklogs[i]['created']);
          console.log(Worklogs[i]['updated']);
          console.log(Worklogs[i]['started']);
          console.log(Worklogs[i]['timeSpent']);
          console.log(Worklogs[i]['author']['accountId']);*/
      
           
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
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}


/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req,res){

    try {
        const { username, password, profile, email } = req.body;        

        // check the existing user
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function(err, user){
                if(err) reject(new Error(err))
                if(user) reject({ error : "Please use unique username"});

                resolve();
            })
        });

        // check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function(err, email){
                if(err) reject(new Error(err))
                if(email) reject({ error : "Please use unique Email"});

                resolve();
            })
        });


        Promise.all([existUsername, existEmail])
            .then(() => {
                if(password){
                    bcrypt.hash(password, 10)
                        .then( hashedPassword => {
                            
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            // return save result as a response
                            user.save()
                                .then(result => res.status(201).send({ msg: "User Register Successfully"}))
                                .catch(error => res.status(500).send({error}))

                        }).catch(error => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                }
            }).catch(error => {
                return res.status(500).send({ error })
            })


    } catch (error) {
        return res.status(500).send(error);
    }


}


/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req,res){
   
    const { username, password } = req.body;

    try {
        
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

                        // create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        username : user.username
                                    }, ENV.JWT_SECRET , { expiresIn : "24h"});

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


/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req,res){
    
    const { username } = req.params;

    try {
        
        if(!username) return res.status(501).send({ error: "Invalid Username"});

        UserModel.findOne({ username }, function(err, user){
            if(err) return res.status(500).send({ err });
            if(!user) return res.status(501).send({ error : "Couldn't Find the User"});

            /** remove password from user */
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(rest);
        })

    } catch (error) {
        return res.status(404).send({ error : "Cannot Find User Data"});
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
export async function updateUser(req,res){
    try {
        
        // const id = req.query.id;
        const { userId } = req.user;

        if(userId){
            const body = req.body;

            // update the data
            UserModel.updateOne({ _id : userId }, body, function(err, data){
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


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
   if(req.app.locals.resetSession){
        return res.status(201).send({ flag : req.app.locals.resetSession})
   }
   return res.status(440).send({error : "Session expired!"})
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req,res){
    try {
        
        if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

        const { username, password } = req.body;

        try {
            
            UserModel.findOne({ username})
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username : user.username },
                            { password: hashedPassword}, function(err, data){
                                if(err) throw err;
                                req.app.locals.resetSession = false; // reset session
                                return res.status(201).send({ msg : "Record Updated...!"})
                            });
                        })
                        .catch( e => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error : "Username not Found"});
                })

        } catch (error) {
            return res.status(500).send({ error })
        }

    } catch (error) {
        return res.status(401).send({ error })
    }
}


