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
import Project from '../model/issues.model.js';
import ShiftsByWeek from '../model/ShiftsByWeek.model.js';
import Issue from '../model/issues.model.js';



// connecting to teams api using ms graph , gathering the data of the week 
// reforming the response and saving the data in mongo db the collection name is shiftsbyweek

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

    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay); // Set to Sunday midnight
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // Set to next Sunday midnight
    endOfWeek.setHours(23, 59, 59, 999);

    const startDateString = `${startOfWeek.getFullYear()}-${(startOfWeek.getMonth() + 1).toString().padStart(2, '0')}-${startOfWeek.getDate().toString().padStart(2, '0')}`;
    const endDateString = `${endOfWeek.getFullYear()}-${(endOfWeek.getMonth() + 1).toString().padStart(2, '0')}-${endOfWeek.getDate().toString().padStart(2, '0')}`;
    
    const addeddate='T00:00:00.000Z';

    const startDate = startDateString.concat(addeddate);
    const endDate = endDateString.concat(addeddate);


    let shiftsConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://graph.microsoft.com/v1.0/teams/d9f935aa-0d31-403d-9d4f-33728253b85a/schedule/shifts?$filter=sharedShift/startDateTime ge ${startDate} and sharedShift/endDateTime le ${endDate} `,
      headers: {
        'MS-APP-ACTS-AS': 'nassim.jloud@avaxia-group.com',
        'Authorization': 'Bearer ' + accessToken
      }
    };
    const shiftsResponse = await axios.request(shiftsConfig);
    const shiftsData = shiftsResponse.data;

    if (shiftsData && shiftsData.value && Array.isArray(shiftsData.value)) {
      // Fetch user information for each user ID if permission is granted
      const userIds = shiftsData.value.map((shiftData) => shiftData.userId);
      const userDisplayNameMap = {};
      const userEmailMap = {};

      for (const userId of userIds) {
        let displayName = userId; // Default to using userId as displayName
        let email = null; // Initialize email as null

        try {
          const userConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://graph.microsoft.com/v1.0/users/${userId}`,
            headers: {
              'Authorization': 'Bearer ' + accessToken
            }
          };
          const userResponse = await axios.request(userConfig);
          const userData = userResponse.data;
          displayName = userData.displayName;
          email = userData.mail; // Get the email from the user data
        } catch (error) {
          console.log('Failed to fetch user data:', error);
        }

        userDisplayNameMap[userId] = displayName;
        userEmailMap[userId] = email;
      }

      // Organize the shifts data into groups (each group contains users, and each user has their shifts)
      const shiftsByGroup = {};

      for (const shiftData of shiftsData.value) {
        const sharedShift = shiftData.sharedShift || {};
        const groupId = shiftData.schedulingGroupId;
        const userId = shiftData.userId;
        const displayName = userDisplayNameMap[userId];
        const email = userEmailMap[userId]; // Get the email for this user

        if (!shiftsByGroup[groupId]) {
          // Fetch the group name if it doesn't exist in the shiftsByGroup object
          let groupName = groupId; // Default to using groupId as groupName

          try {
            const groupConfig = {
              method: 'get',
              maxBodyLength: Infinity,
              url: `https://graph.microsoft.com/v1.0/groups/${groupId}`,
              headers: {
                'Authorization': 'Bearer ' + accessToken
              }
            };
            const groupResponse = await axios.request(groupConfig);
            const groupData = groupResponse.data;
            groupName = groupData.displayName;
          } catch (error) {
            console.log('Failed to fetch group data:', error);
          }

          shiftsByGroup[groupId] = { groupName, users: {} };
        }

        if (!shiftsByGroup[groupId].users[userId]) {
          shiftsByGroup[groupId].users[userId] = {
            displayName,
            email, // Include the email in the response
            shifts: [],
          };
        }

        shiftsByGroup[groupId].users[userId].shifts.push({
          id: shiftData.id,
          displayName:sharedShift.displayName,
          createdDateTime: shiftData.createdDateTime,
          lastModifiedDateTime: shiftData.lastModifiedDateTime,
          lastModifiedBy: shiftData.lastModifiedBy,
          startDateTime: sharedShift.startDateTime,
          endDateTime: sharedShift.endDateTime,
          notes: sharedShift.notes,
        });
      }

   
      // Prepare the response data
      const responseData = {
        week: {
          startOfWeek: startDate,
          endOfWeek: endDate,
        },
        shiftsByGroup: shiftsByGroup,
      };
      // Save or update the response data in the database
    const existingData = await ShiftsByWeek.findOne({ startDate, endDate });
    if (existingData) {
      // Update existing entry
      existingData.data = responseData;
      await existingData.save();
    } else {
      // Create new entry
      const newShiftsByWeek = new ShiftsByWeek({
        startDate,
        endDate,
        data: shiftsByGroup,
      });
      await newShiftsByWeek.save();
    }

      response.json({ responseData });
    } else {
      throw new Error('Invalid shifts data received');
    }
  } catch (error) {
    console.log(error);
    response.status(500).send('Failed to fetch and save data.');
  }
}

// connecting to jira api and forming a json response containing all the data of projects , users , 
// issues and worklogs , and saving in database
export async function getIssues(req, res) {
  try {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + 1); // Set to Sunday midnight
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setUTCHours(0); // Set UTC hours to ensure consistent time
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // Set to next Sunday midnight
    endOfWeek.setHours(23, 59, 59, 999);
    endOfWeek.setUTCHours(23); // Set UTC hours to ensure consistent time
    
    const startDate = startOfWeek.toISOString();
    const endDate = endOfWeek.toISOString();

    const authHeader = `Basic ${Buffer.from('raed.houimli@avaxia-group.com:ATATT3xFfGF00YV_MQIjYKEHqKYBJzDBPKb1US9miwCek5YrufLycXMjhrQgsHKC4contO9r4WBf-fKGurcZ3rjgszYxbyG2l8QSKgEj1ixrDyR2B4yyv2r2RnQpoMpGt44LacMkr3MGzxAnIXxuiKt1PB2gAKDgOqH7365nzAga2dID-_LC4Q4=01FC55E8').toString('base64')}`;

    const projectsApiUrl = 'https://avaxia.atlassian.net/rest/api/3/project';
    const projectsResponse = await fetch(projectsApiUrl, {
      method: 'GET',
      headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
    });
    const projectsData = await projectsResponse.json();

    const projectResponse = [];

    for (const project of projectsData) {
      const { name: projectName, id: projectId } = project;
      const projectObject = {
        projectName: projectName,
        users: []
      };

      const jiraApiUrl = `https://avaxia.atlassian.net/rest/api/3/search?jql=project=${projectId}&maxResults=100`;
      const jiraResponse = await fetch(jiraApiUrl, {
        method: 'GET',
        headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
      });
      const issuesData = await jiraResponse.json();
      const issues = issuesData.issues;

      for (const issue of issues) {
        const { fields } = issue;
        const { assignee } = fields;

        if (!assignee) {
          continue;
        }

        const assigneeAccountId = assignee.accountId;
        const assigneeEmail = assignee.emailAddress;
        const assigneeDisplayName = assignee.displayName;

        if (!assigneeAccountId || !assigneeEmail || !assigneeDisplayName) {
          continue;
        }

        const worklogsUrl = `https://avaxia.atlassian.net/rest/api/3/issue/${issue.id}/worklog`;
        const worklogsResponse = await fetch(worklogsUrl, {
          method: 'GET',
          headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
        });
        const worklogsData = await worklogsResponse.json();
        const filteredWorklogs = worklogsData.worklogs.filter(worklog => {
          const startedDate = new Date(worklog.started);
          return startedDate >= startOfWeek && startedDate <= endOfWeek;
        });

        if (!filteredWorklogs.length) {
          continue;
        }

        const issueObject = {
          issueId: issue.id,
          issueKey: issue.key,
          summary: fields.summary,
          worklogs: filteredWorklogs.map(worklog => ({
            created: worklog.created,
            updated: worklog.updated,
            timeSpent: worklog.timeSpent,
            started: worklog.started,
          }))
        };

        const userObject = {
          displayName: assigneeDisplayName,
          email: assigneeEmail,
          issues: [issueObject]
        };

        const existingUser = projectObject.users.find(user => user.email === assigneeEmail);
        if (existingUser) {
          existingUser.issues.push(issueObject);
        } else {
          projectObject.users.push(userObject);
        }
      }

      projectResponse.push(projectObject);
    }

    const responseData = {
      week: {
        startOfWeek: startDate,
        endOfWeek: endDate,
      },
      project: projectResponse,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('FAILED TO CONNECT!', error.stack || error.message || error);
    return res.status(500).send('Failed to fetch issues.');
  }
}














export async function fetchShiftsData(req, res) {
  try {
    const shifts = await Shift.find();
    // Check if there are any shifts in the database
    if (shifts.length === 0) {
      return res.json({ message: 'Not enough data' });
    }
    // Group the shifts by the week start date
    const shiftsByWeek = shifts.reduce((acc, shift) => {
      const weekStartDate = moment(shift.startDateTime).startOf('week').toISOString();
      acc[weekStartDate] = acc[weekStartDate] || [];
      acc[weekStartDate].push(shift);
      return acc;
    }, {});
    // Find the first week's shifts (any week) from the grouped data
    const firstWeekShifts = Object.values(shiftsByWeek)[0];
    if (firstWeekShifts) {
      // If there are shifts for any week, send them as JSON response
      return res.json(firstWeekShifts);
    } else {
      // If no data is found for any week, send a response indicating insufficient data
      return res.json({ message: 'Not enough data' });
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    // Send a generic response for any error occurred
    res.status(500).json({ message: 'Error retrieving data' });
  }
}

export async function getCurrentWeekData(req, res) {
  const today = new Date();
  const currentDay = today.getDay(); 
  const weekStartDate = new Date(today);
  weekStartDate.setDate(today.getDate() - currentDay);
  weekStartDate.setHours(0, 0, 0, 0);

  const weekEndDate = new Date(today);
  weekEndDate.setDate(weekStartDate.getDate() + 6);
  weekEndDate.setHours(23, 59, 59, 999);

  try {
    const shiftUsersEmails = await ShiftsByWeek.aggregate([
      { $match: { 'startDate': { $gte: weekStartDate }, 'endDate': { $lte: weekEndDate } } },
      { $project: { 'data': 1 } },
      { $unwind: '$data' },
      { $unwind: '$data.users' },
      { $project: { _id: 0, email: '$data.users.email' } }
    ]).exec();

    const issueUsersEmails = await Issue.aggregate([
      { $unwind: '$issues' },
      { $unwind: '$issues.worklogs' },
      {
        $match: {
          'issues.worklogs.started': {
            $gte: weekStartDate,
            $lte: weekEndDate,
          },
        },
      },
      { $project: { _id: 0, email: 1 } },
    ]).exec();

    const commonUsersEmails = shiftUsersEmails.filter(shiftUser => issueUsersEmails.some(issueUser => issueUser.email === shiftUser.email));

    const usersInShiftsOnlyEmails = shiftUsersEmails.filter(shiftUser => !issueUsersEmails.some(issueUser => issueUser.email === shiftUser.email));

    const usersInIssuesOnlyEmails = issueUsersEmails.filter(issueUser => !shiftUsersEmails.some(shiftUser => shiftUser.email === issueUser.email));

    res.json({ commonUsersEmails, usersInShiftsOnlyEmails, usersInIssuesOnlyEmails });
  } catch (error) {
    console.error('Failed to fetch data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}


export async function getUsersWithShiftsToday(req, res) {
  try {
    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setUTCHours(0, 0, 0, 0);

    const todayEnd = new Date(today);
    todayEnd.setUTCHours(23, 59, 59, 999);

    const usersWithShiftsToday = [];

    const shiftsByWeek = await ShiftsByWeek.findOne({
      'startDate': { $lte: todayEnd },
      'endDate': { $gte: todayStart },
    });

    if (shiftsByWeek && shiftsByWeek.data && shiftsByWeek.data.users) {
      const userGroups = Object.values(shiftsByWeek.data.users);

      for (const userGroup of userGroups) {
        for (const userShifts of userGroup) {
          if (
            userShifts.shifts &&
            userShifts.shifts.length > 0
          ) {
            for (const shift of userShifts.shifts) {
              if (
                shift.startDateTime &&
                shift.endDateTime &&
                new Date(shift.startDateTime) <= todayEnd &&
                new Date(shift.endDateTime) >= todayStart
              ) {
                usersWithShiftsToday.push(userShifts);
                break;
              }
            }
          }
        }
      }
    }

    res.json(usersWithShiftsToday);
  } catch (error) {
    console.error('Failed to fetch data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}




export async function fetchworklogs(req, res) {
  try {
    // Retrieve all documents from the 'assignees' collection
    const assignees = await Assignee.find();
    // Filter the worklogs for the current week (Monday to Sunday)
    const currentWeekStart = moment().startOf('isoWeek'); // Get the start of the current week (Monday)
    const currentWeekEnd = moment().endOf('isoWeek'); // Get the end of the current week (Sunday)
    // Check if there is existing worklogs data for the current week in the 'weeksdata' collection
    const existingWeekData = await weekdata.findOne({ week: `week_${currentWeekStart.format('YYYY-MM-DD')}` });
    if (existingWeekData && !isWeekDataComplete(existingWeekData.data)) {
      // Update the existing incomplete data and return it
      const updatedData = updateIncompleteData(existingWeekData.data, assignees, currentWeekStart, currentWeekEnd);
      await weekdata.updateOne({ week: existingWeekData.week }, { $set: { data: updatedData } });
      // Send the updated data as JSON response
      res.json(updatedData);
    } else {
      // Filter and store the worklogs data for the current week
      const filteredAssignees = filterWorklogsData(assignees, currentWeekStart, currentWeekEnd);
      // Save the filtered data into the 'weeksdata' collection
      const weekData = {
        week: `week_${currentWeekStart.format('YYYY-MM-DD')}`,
        data: filteredAssignees,
      };
      await weekdata.findOneAndUpdate(
        { week: weekData.week },
        { $set: weekData },
        { upsert: true }
      );
      // Send the filtered data as JSON response
      res.json(filteredAssignees);
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    // Send an error response if needed
    res.status(500).json({ error: 'Internal server error' });
  }
}


function isWeekDataComplete(data) {
  // Check if the week data is complete by examining the required properties
  // You can customize the logic based on your specific data structure
  return data.every(assignee => assignee.issues.every(issue => issue.isComplete));
}


function updateIncompleteData(data, assignees, currentWeekStart, currentWeekEnd) {
  // Update the incomplete data based on your specific requirements
  // You can modify this function to update the data structure as needed

  // Example: Set all incomplete issues to complete
  return data.map(assignee => ({
    ...assignee,
    issues: assignee.issues.map(issue => ({
      ...issue,
      isComplete: true
    }))
  }));

  // Implement your own update logic based on the data structure and requirements
}
function filterWorklogsData(assignees, currentWeekStart, currentWeekEnd) {
  // Filter the worklogs data for the current week based on your specific requirements
  // You can modify this function to filter the data structure as needed
  // Example: Filter worklogs based on the created date
  return assignees.map(assignee => ({
    assigneeName: assignee.assigneeName,
    assigneeEmail: assignee.assigneeEmail,
    issues: assignee.issues.reduce((filteredIssues, issue) => {
      const filteredWorklogs = issue.worklogs.filter(worklog => {
        const createdDate = moment(worklog.created);
        return createdDate.isBetween(currentWeekStart, currentWeekEnd, 'day', '[]');
      });
      if (filteredWorklogs.length > 0) {
        filteredIssues.push({ ...issue, worklogs: filteredWorklogs });
      }
      return filteredIssues;
    }, [])
  })).filter(assignee => assignee.issues.length > 0);
  // Implement your own filtering logic based on the data structure and requirements
}






  export async function getIssuesForCurrentWeek(req, res) {
    try {
      const today = new Date();
      const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  
      // Calculate the start and end dates of the current week (Monday to Sunday midnight)
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - currentDay + 1); // Set to Monday of the current week
      startDate.setHours(0, 0, 0, 0); // Set time to midnight
  
      const endDate = new Date(today);
      endDate.setDate(startDate.getDate() + 6); // Set to Sunday of the current week
      endDate.setHours(23, 59, 59, 999); // Set time to Sunday midnight
  
      // Format the dates as ISO strings to use in the Jira JQL
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
  
      const projectsApiUrl = 'https://avaxia.atlassian.net/rest/api/3/project';
      const authHeader = `Basic ${Buffer.from('raed.houimli@avaxia-group.com:ATATT3xFfGF00YV_MQIjYKEHqKYBJzDBPKb1US9miwCek5YrufLycXMjhrQgsHKC4contO9r4WBf-fKGurcZ3rjgszYxbyG2l8QSKgEj1ixrDyR2B4yyv2r2RnQpoMpGt44LacMkr3MGzxAnIXxuiKt1PB2gAKDgOqH7365nzAga2dID-_LC4Q4=01FC55E8').toString('base64')}`;
  
      const projectsResponse = await fetch(projectsApiUrl, {
        method: 'GET',
        headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
      });
      const projectsData = await projectsResponse.json();
  
      const projectsWithIssues = {};
  
      for (const project of projectsData) {
        const projectKey = project.key;
  
        const jiraApiUrl = `https://avaxia.atlassian.net/rest/api/3/search?jql=project=${projectKey} AND created >= ${formattedStartDate} AND created <= ${formattedEndDate}&maxResults=1000`;
  
        const response = await fetch(jiraApiUrl, {
          method: 'GET',
          headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
        });
        const issuesData = await response.json();
        const issues = issuesData.issues;
  
        for (const issue of issues) {
          const assignee = issue.fields.assignee;
          const assigneeAccountId = assignee ? assignee.accountId : undefined;
          const assigneeEmail = assignee ? assignee.emailAddress : undefined;
          const assigneeDisplayName = assignee ? assignee.displayName : undefined;
          const issueId = issue.id;
          const issueKey = issue.key;
          const summary = issue.fields.summary;
  
          // Retrieve worklogs for each issue
          const worklogsUrl = `https://avaxia.atlassian.net/rest/api/3/issue/${issueId}/worklog`;
  
          // Rest of the code remains the same as before
  
          // ...
        }
      }
  
      // Respond with the organized projects data
      return res.json(projectsWithIssues);
    } catch (error) {
      console.error('FAILED TO CONNECT!', error.stack || error.message || error);
      // Handle the error and send an appropriate response
      return res.status(500).send('Failed to fetch issues.');
    }
  }
  



  export async function getIssueDataForCurrentWeek(request , res) {
    try {

      // Calculate the start and end dates of the current week (Monday to Sunday)
      const today = new Date();
      const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - currentDay + 1); // Set to Monday of the current week
      startDate.setHours(0, 0, 0, 0); // Set time to midnight
      const endDate = new Date(today);
      endDate.setDate(startDate.getDate() + 6); // Set to Sunday of the current week
      endDate.setHours(23, 59, 59, 999); // Set time to Sunday midnight
  
      // Retrieve issues for the current week
    const issues = await Issue.find({
      startDate: { $gte: startDate, $lte: endDate },
    });

    // Construct the JSON response
    const responseData = {
      startDate: startDate,
      endDate: endDate,
      issues: issues,
    };

    return res.status(200).json(responseData);
    } catch (error) {
      console.error('Failed to fetch data from the database:', error);
      response.status(500).send('Failed to fetch data from the database.');
    }
  }
  


 
    


export async function getShiftsForCurrentWeek(request, response) {
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

    // Calculate the date range for the current week (from Monday to Sunday)
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Set to Monday
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 7); // Set to Sunday

    let shiftsConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://graph.microsoft.com/v1.0/teams/d9f935aa-0d31-403d-9d4f-33728253b85a/schedule/shifts?$filter=sharedShift/startDateTime ge 2023-03-10T00:00:00.000Z and sharedShift/endDateTime le 2023-03-11T00:00:00.000Z`,
      headers: {
        'MS-APP-ACTS-AS': 'nassim.jloud@avaxia-group.com',
        'Authorization': 'Bearer ' + accessToken
      }
    };
    const shiftsResponse = await axios.request(shiftsConfig);
    const shiftsData = shiftsResponse.data;

    if (shiftsData && shiftsData.value && Array.isArray(shiftsData.value)) {
      // Organize the shifts data into groups (each group contains users, and each user has their shifts)
      const shiftsByGroup = {};

      for (const shiftData of shiftsData.value) {
        const sharedShift = shiftData.sharedShift || {};
        const groupId = shiftData.schedulingGroupId;
        const userId = shiftData.userId;
        const userEmail = await getUserEmail(userId, accessToken); // Fetch user email using the Microsoft Graph API

        if (!shiftsByGroup[groupId]) {
          shiftsByGroup[groupId] = {};
        }

        if (!shiftsByGroup[groupId][userId]) {
          shiftsByGroup[groupId][userId] = {
            displayName: sharedShift.displayName,
            email: userEmail, // Include the email here
            shifts: [],
          };
        }

        shiftsByGroup[groupId][userId].shifts.push({
          id: shiftData.id,
          etag: shiftData['@odata.etag'],
          createdDateTime: shiftData.createdDateTime,
          lastModifiedDateTime: shiftData.lastModifiedDateTime,
          startDateTime: sharedShift.startDateTime,
          endDateTime: sharedShift.endDateTime,
          theme: sharedShift.theme,
          notes: sharedShift.notes,
          activities: sharedShift.activities,
          lastModifiedBy: shiftData.lastModifiedBy,
        });
      }

      // Respond with the organized shifts data by group
      response.json(shiftsByGroup);
    } else {
      throw new Error('Invalid shifts data received');
    }
  } catch (error) {
    console.log(error);
    response.status(500).send('Failed to fetch and save data.');
  }
}

// Function to fetch user email using Microsoft Graph API
async function getUserEmail(userId, accessToken) {
  try {
    const authProvider = {
      getAccessToken: () => Promise.resolve(accessToken),
    };

    const options = {
      authProvider,
    };

    const client = Client.init(options);
    const user = await client.api(`/users/${userId}`).get();
    return user.mail || '';
  } catch (error) {
    console.log(`Failed to fetch email for user with ID: ${userId}`);
    return '';
  }
}

    
    
    




export async function getIssuesForTheCurrentWeek(req, res) {
  try {
    // Calculate the date range for the current week (from Monday to Sunday)
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Set to Monday
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 7); // Set to Sunday
    const jiraApiUrl = `https://avaxia.atlassian.net/rest/api/3/?jql/project=DIN&maxResults=1000`;
    /*created >= ${startOfWeek.toISOString()} and created <= ${endOfWeek.toISOString()}*/
    const authHeader = `Basic ${Buffer.from('raed.houimli@avaxia-group.com:ATATT3xFfGF00YV_MQIjYKEHqKYBJzDBPKb1US9miwCek5YrufLycXMjhrQgsHKC4contO9r4WBf-fKGurcZ3rjgszYxbyG2l8QSKgEj1ixrDyR2B4yyv2r2RnQpoMpGt44LacMkr3MGzxAnIXxuiKt1PB2gAKDgOqH7365nzAga2dID-_LC4Q4=01FC55E8').toString('base64')}`;
    const response = await fetch(jiraApiUrl, { method: 'GET', headers: { 'Authorization': authHeader, 'Accept': 'application/json' } });
    const issuesData = await response.json();
   

    if (issuesData && issuesData.issues && Array.isArray(issuesData.issues)) {
      const assigneeIssues = {};
      for (const issue of issuesData.issues) {
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
      // Respond with the formatted shifts data
      res.json(assigneeIssues);
    } else {
      throw new Error('No issues found for the current week.');
    }
  } catch (error) {
    console.log('FAILED TO CONNECT!', error);
    // Handle the error and send an appropriate response
    res.status(500).send('Failed to fetch issues for the current week.');
  }
}








export async function getShiftsByDate(request, response) {
  try {
    // Set your app credentials and desired permissions
    let data = qs.stringify({
      'grant_type': 'client_credentials',
      'client_id': 'd9452d4b-7b90-49cb-96a9-dbd03bbbc1ec',
      'scope': 'https://graph.microsoft.com/.default',
      'client_secret': 'uo6k~B1F.2_yA~O5Mqf5rLMCP0KgXS14_Y',
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

    // Calculate the date range for the current week (from Monday to Sunday)
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Set to Monday
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 7); // Set to Sunday
    endOfWeek.setHours(23, 59, 59, 999); // Set to the end of Sunday

    const startDateString = `${startOfWeek.toISOString()}`;
    const endDateString = `${endOfWeek.toISOString()}`;


    let shiftsConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://graph.microsoft.com/v1.0/teams/d9f935aa-0d31-403d-9d4f-33728253b85a/schedule/shifts?$filter=sharedShift/startDateTime ge ${startDateString} and sharedShift/startDateTime le ${endDateString}`,
      headers: {
        'MS-APP-ACTS-AS': 'nassim.jloud@avaxia-group.com',
        'Authorization': 'Bearer ' + accessToken
      }
    };
    const shiftsResponse = await axios.request(shiftsConfig);
    const shiftsData = shiftsResponse.data;

    if (shiftsData && shiftsData.value && Array.isArray(shiftsData.value)) {
      // Organize the shifts data into groups by date
      const shiftsByDate = {};

      for (const shiftData of shiftsData.value) {
        const sharedShift = shiftData.sharedShift || {};
        const startDateTime = new Date(sharedShift.startDateTime);
        const dateString = startDateTime.toISOString().split('T')[0];

        if (!shiftsByDate[dateString]) {
          shiftsByDate[dateString] = [];
        }

        shiftsByDate[dateString].push({
          id: shiftData.id,
          createdDateTime: shiftData.createdDateTime,
          lastModifiedDateTime: shiftData.lastModifiedDateTime,
          draftShift: shiftData.draftShift,
          lastModifiedBy: shiftData.lastModifiedBy,
          startDateTime: sharedShift.startDateTime,
          endDateTime: sharedShift.endDateTime,
          theme: sharedShift.theme,
          notes: sharedShift.notes,
        });
      }
       // Prepare the response data
       const responseData = {
        week: {
          startOfWeek: startOfWeek.toISOString().split('T')[0],
          endOfWeek: endOfWeek.toISOString().split('T')[0],
        },
        shiftsByGroup: shiftsByGroup,
      };

      response.json({ responseData });
    } else {
      throw new Error('Invalid shifts data received');
    }
  } catch (error) {
    console.log(error);
    response.status(500).send('Failed to fetch and save data.');
  }
}



export async function getShiftsByWeekForCurrentWeek(request, response) {
  try {

    // Calculate the start and end dates of the current week (Monday to Sunday)
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay + 1); // Set to Monday of the current week
    startDate.setHours(0, 0, 0, 0); // Set time to midnight
    const endDate = new Date(today);
    endDate.setDate(startDate.getDate() + 6); // Set to Sunday of the current week
    endDate.setHours(23, 59, 59, 999); // Set time to Sunday midnight

    // Fetch documents from the ShiftsByWeek collection for the current week
    const shiftsByWeekData = await ShiftsByWeek.find({
      'week.startDate': { $gte: startDate, $lte: endDate },
    });



    // Respond with the fetched data
    response.json(shiftsByWeekData);
  } catch (error) {
    console.error('Failed to fetch data from the database:', error);
    response.status(500).send('Failed to fetch data from the database.');
  }
}



  
//GET WORKLOGS

export async function worklogs(){
    try{
       console.log("hi");
       
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


