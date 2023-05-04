import { useState, useEffect } from 'react';
import axios from 'axios';

function Worklogs() {
  const [issues, setIssues] = useState([]);
  try{
  useEffect(() => {
    
    const fetchData = async () => {
      const issues = await axios.get('http://localhost:8080/api/issues');
      console.log(issues);
      const data = await issues.json();
      setIssues(data);
        

    };

  fetchData(); 
  }, []);

}catch(error){
  console.log(error);

}
  return (
    <div>
      {Object.entries(issues).map(([email, data]) => (
        <div key={email}>
          <h3>{data['Assignee Name']}</h3>
          {Object.entries(data.Issues).map(([id, issue]) => (
            <div key={id}>
              <p><strong>{issue['Issue Key']}</strong>: {issue.Summary}</p>
              <ul>
                {issue.Worklogs.map((worklog) => (
                  <li key={worklog.id}>{worklog.comment}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Worklogs;
