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
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    // Display a confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/usersdata/${userId}`);
        // After successful deletion, you may want to update the user list.
        // You can re-fetch the data or update the state as needed.
      } catch (error) {
        console.log(error);
      }
    }
  };

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
                <button onClick={() => handleDeleteUser(user._id)}>
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
