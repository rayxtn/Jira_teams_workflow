import React, { useEffect, useState } from "react";


const WorklogComponent = () => {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    fetch("http://localhost:3001/worklog/DIN-23", {'Access-Control-Allow-Origin': '*'}, {method: 'GET', mode: 'cors'}).then((response) =>
      console.log(response)
    );
  }, []);

  //console.log(data);

};

export default WorklogComponent;
