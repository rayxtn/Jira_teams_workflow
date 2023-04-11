// using the 'node-fetch' library:
import fetch from 'node-fetch';
import  express  from 'express';
import cors from 'cors';
// eslint-disable-next-line no-undef
const app = express()

app.use(cors())

const express = require('express');
const router = express.Router();
const { Client } = require('@microsoft/microsoft-graph-client');

// Microsoft Teams credentials
const clientId = '<your_client_id>';
const clientSecret = '<your_client_secret>';
const tenantId = '<your_tenant_id>';

// Endpoint to get all tasks and plans from Microsoft Teams
router.get('/tasks', async (req, res) => {
  try {
    // Authenticate with Microsoft Graph API
    const client = await getClient();

    // Get all tasks
    const tasks = await client
      .api('/teams/{team-id}/tasks')
      .get();

    // Get all plans
    const plans = await client
      .api('/planner/plans')
      .get();

    // Combine tasks and plans
    const tasksWithPlans = tasks.value.map(task => {
      const plan = plans.value.find(plan => plan.id === task.planId);
      return { ...task, plan };
    });

    res.status(200).json(tasksWithPlans);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to authenticate with Microsoft Graph API
async function getClient() {
  const client = Client.init({
    authProvider: (done) => {
      done(null, {
        accessToken: '<your_access_token>',
        tokenType: 'Bearer'
      });
    }
  });

  return client;
}



