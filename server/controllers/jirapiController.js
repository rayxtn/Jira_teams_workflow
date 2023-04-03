// This code sample uses the 'node-fetch' library:
import worklogs from "../model/worklogs.model.js"
import fetch from 'node-fetch';
import  express  from 'express';
import cors from 'cors';
// eslint-disable-next-line no-undef
const app = express()

app.use(cors())

app.get('/worklog/:issueIdOrKey', (req, res) => {
  const id = req.params.issueIdOrKey;
  const jiraApiUrl = `https://avaxia.atlassian.net/rest/api/3/issue/${id}/worklog`
  const authHeader = `Basic ${Buffer.from('raed.houimli@avaxia-group.com:ATATT3xFfGF032Dix_N3BkCIX-3mDVULlTmoFcYd9rZBFofjcHiejr15TJzbQD-NgRiHdzrwww5udeSDQHyup8oQwDCsd1QYi6C2ybxxU5AcKngynIA3o-X-Sbf-Cdjn2edrnyh8jiH1O3yh2FRbmDg5Vcc9Gei4L7JFZKoMXh5Aq4BsuEhqt3w=5735F2F9').toString('base64')}`
  fetch(jiraApiUrl, { method: 'GET', headers: { 'Authorization': authHeader, 'Accept': 'application/json' }})
    .then(response => response.text())
    .then(text => {
      const resp = JSON.parse(text)
      const processedData = resp.worklogs.map(item => ({
        id: item.id,
        author: item.author,
        description: item.comment,
        timeSpent: item.timeSpentSeconds
      }))
      res.send({ worklogData: processedData })
      console.log(processedData.item.author);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ message: 'Error fetching worklog data' })
    })
})

/*app.get('/teamsData/:groupId', (req, res) => {
  const id = req.params.groupId

  const teamsApi = `https://graph.microsoft.com/v1.0/planner/plans/${id}/tasks`
  const authHeader = `Basic ${Buffer.from('raed.houimli@avaxia-group.com:').toString('base64')}`
  fetch(teamsApi, { method: 'GET', headers: { 'Authorization': authHeader }})
    .then(response => response.text())
    .then(text => {
      const resp = JSON.parse(text)
      const processedData = resp.data.map(item => ({
       ...item
      }))
      res.send({ teamsData: processedData })
    })
    .catch(err => { 
      console.log(err)
      res.status(500).send({ message: 'Error fetching worklog data' })
    })

}) */

