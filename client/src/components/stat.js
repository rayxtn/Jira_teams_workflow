import React, { useState, useEffect } from 'react';
import { VictoryPie, VictoryLabel, VictoryLegend } from 'victory';
import { css } from '@emotion/react';
import { RingLoader } from 'react-spinners';

function ShiftValidationStats() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [validatedUsers, setValidatedUsers] = useState(0);
  const [nonValidatedUsers, setNonValidatedUsers] = useState(0);
  const [groupData, setGroupData] = useState([]);

  useEffect(() => {
    setLoading(true); // Set loading to true while data is being fetched

    // Fetch data from the API
    fetch('http://localhost:8080/api/validation')
      .then((response) => response.json())
      .then((data) => {
        setData(data);

        // Calculate the number of validated and non-validated users
        let validatedCount = 0;
        let nonValidatedCount = 0;

        // Use a Set to store unique group names
        const uniqueGroupNames = new Set();

        for (const groupKey in data) {
          for (const userEmail in data[groupKey]) {
            const user = data[groupKey][userEmail];
            const hasNonValidatedShift = user.shifts.some((shift) => !shift.validated);

            if (!hasNonValidatedShift) {
              validatedCount++;
            } else {
              nonValidatedCount++;
            }

            // Add the group name to the Set
            uniqueGroupNames.add(groupKey);
          }
        }

        // Convert the Set to an array to get unique group names
        const uniqueGroups = Array.from(uniqueGroupNames);

        // Count the number of users in each group
        const groupCounts = uniqueGroups.map((group) => ({
          group,
          userCount: Object.keys(data[group]).length,
        }));

        setValidatedUsers(validatedCount);
        setNonValidatedUsers(nonValidatedCount);
        setGroupData(groupCounts);

        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, []);

  const pieData = [
    { x: 'Validated Users', y: validatedUsers },
    { x: 'Non-Validated Users', y: nonValidatedUsers },
  ];

  const groupColors = [
    '#FF5733',
    '#33FF46',
    '#3363FF',
    '#FF33EA',
    '#E6E333',
    '#CD5C5C',
    '#00FFFF',
    '#663399',
    '#FF69B4',
    '#ADFF2F',
    '#8A2BE2',
    '#FF4500',
    '#D2691E',
    // Add more unique colors as needed
  ];

  return (
    <div>
      {loading ? ( // Conditionally render the progress bar when loading is true
        <div className="loading-spinner">
          <RingLoader color="#36D7B7" loading={loading} css={css`margin: 150px auto;`} size={150} />
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'left' }}>
            <div style={{ maxWidth: '500px', marginRight: '0px' }}>
              <svg width={500} height={500}>
                <VictoryPie
                  standalone={false}
                  data={pieData}
                  innerRadius={70}
                  labelComponent={<VictoryLabel />}
                  style={{
                    labels: { fontSize: 6 },
                  }}
                  colorScale={groupColors}
                />
                <VictoryLegend
                  x={200}
                  y={350}
                  orientation="horizontal"
                  data={pieData.map((d) => ({ name: d.x }))}
                  style={{
                    labels: { fontSize: 5 },
                  }}
                />
              </svg>
            </div>
            <div style={{ maxWidth: '500px' }}>
              <svg width={500} height={500}>
                <VictoryPie
                  standalone={false}
                  data={groupData.map((group) => ({ x: group.group, y: group.userCount }))}
                  innerRadius={70}
                  labelComponent={<VictoryLabel />}
                  style={{
                    labels: { fontSize: 10 },
                  }}
                  colorScale={groupColors}
                />
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'left', marginBottom: 'px' }}>
            {groupData.map((group, index) => (
              <div key={index} style={{ color: groupColors[index], fontSize: 5, marginRight: '0px' }}>
                {group.group}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ShiftValidationStats;
