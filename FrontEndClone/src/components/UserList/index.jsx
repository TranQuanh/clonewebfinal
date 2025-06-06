import React, {useState, useEffect} from "react";
import {API_BASE_URL} from "../../config";
import {Link, useLocation} from "react-router-dom";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import "./styles.css";
import models from "../../modelData/models";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const currentPath = location.pathname;
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/list`,
          {
            method: 'GET',
            credentials: 'include'
          },
        );
        if(response.ok) {
          const data = await response.json();
          setUsers(data);
          console.log(data);
        }
      }
      catch(err) {
        console.error('Error fetching users:', err);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      {users.map((user) => (
        <Link key={user._id} to={`/users/${user._id}`}>
          <div className={`user-item ${currentPath === `/users/${user._id}`||currentPath === `/photos/${user._id}` ? 'active' : ''}`}>
            <h2 className="user-name">{user.first_name} {user.last_name}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default UserList;
