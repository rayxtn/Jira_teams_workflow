import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UserTable.css'; // Import your CSS file


function UserTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/usersdata');
        const users = response.data;
        setUsers(users);
        console.log(users);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
 
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => (user._id)}>
                  Delete
                </button>
                <button onClick={() => (user._id)}>
                  rwx
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
