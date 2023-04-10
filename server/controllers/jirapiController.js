//GET ALL ISSUES FROM THE PROJECT 

// DEFINE THE PROJECT ID BEFORE POSTING


export async function getallIssues(){
  try{
      const jiraApiUrl = `https://avaxia.atlassian.net/rest/api/3/search?jql=project=DIN&maxResults=1000`
      const authHeader = `Basic ${Buffer.from('raed.houimli@avaxia-group.com:ATATT3xFfGF0HYsCEFOiZ7PsFk8ex7P7PL65cgCPuiUwMzcR_05BcW3tLT-WIv2_fielw_sBNBV3yCSp6xxkkqhnYjN5EzQjYkoLiDS3R7L_zC-UleRlLtoL1AN067ZTJRXjdDttgoWmgFcxPhaX_90UWLKXq3rQobBOSkhcYHnx8rUjNK4fNQk=98FC84D9').toString('base64')}`          
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
  const authHeader = `Basic ${Buffer.from('raed.houimli@avaxia-group.com:ATATT3xFfGF0HYsCEFOiZ7PsFk8ex7P7PL65cgCPuiUwMzcR_05BcW3tLT-WIv2_fielw_sBNBV3yCSp6xxkkqhnYjN5EzQjYkoLiDS3R7L_zC-UleRlLtoL1AN067ZTJRXjdDttgoWmgFcxPhaX_90UWLKXq3rQobBOSkhcYHnx8rUjNK4fNQk=98FC84D9').toString('base64')}`          
  const myworklogs = await fetch(jiraApiUrl , {headers: { 'Authorization': authHeader, 'Accept': 'application/json' }})
  const response = await myworklogs.json();

   const Worklogs = response.worklogs;
      // console.log(Worklogs);
     // console.log(response.total)
       /*   const worklogsData = response.worklogs.map(item => ({
              id: item.id,
              author: item.author,
              description: item.comment,
              timeSpent: item.timeSpentSeconds
            }));
          */
      for (let i =0; i < Worklogs.length;i++) {
      //console.log(Worklogs[i]['issueId']);
      const work_logs = new worklogs({
          issueId :Worklogs[i]['issueId'],
          created :Worklogs[i]['issueId'],
          updated :Worklogs[i]['updated'],
          started :Worklogs[i]['started'],
          timeSpent :Worklogs[i]['timeSpent'],
          accountId :Worklogs[i]['author']['accountId'],
      });
      try{
      work_logs.save();
      }catch(err){
          console.log(err);
      }
     /* console.log(Worklogs[i]['created']);
      console.log(Worklogs[i]['updated']);
      console.log(Worklogs[i]['started']);
      console.log(Worklogs[i]['timeSpent']);
      console.log(Worklogs[i]['author']['accountId']);*/
  }
       
          }
catch{
  console.log(error);
}

}
