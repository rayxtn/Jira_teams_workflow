import { useState, useEffect } from 'react';
import axios from 'axios';

function Worklogs() {
  const [issues, setIssues] = useState([]);
  try{
  useEffect(() => {
    
    const fetchData = async () => {
      const issues = await axios.get('http://localhost:8080/api/issues');
      console.log(issues);
      setIssues(issues);
    };

  fetchData(); 
  }, []);

}catch(error){
  console.log(error);
}
if(!issues)
{
  return(
  <div>Loading..</div>
  )
}
  return (
    <div>
    { issues && issues.data  && Object.keys(issues.data).map((values, i)=>{
        return(
          <div key={i}>
          <h2>Object {i} :{values}</h2>
          </div>
        );
       }
       )
    }
   
    </div>
  );
}

export default Worklogs;
