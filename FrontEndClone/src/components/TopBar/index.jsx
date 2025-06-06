import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import {API_BASE_URL} from "../../config";
import "./styles.css";
import { useLocation, useParams } from "react-router-dom";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar ({user, onLogout, onPhotoUpload}) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (currentPath.includes("users/") || currentPath.includes("photos/")) {
        const userId = currentPath.includes("users/") 
          ? currentPath.split("/users/")[1]
          : currentPath.split("/photos/")[1];
        if (userId) {
          try {
            const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
              credentials: "include"
            });
            if (response.ok) {
              const userData = await response.json();
              setSelectedUser(userData);
            }
          } catch (error) {
            console.error("Error fetching selected user:", error);
          }
        }
      }
    };

    fetchSelectedUser();
  }, [currentPath]);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/photo/new`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        console.log("Upload photo successfully");
        // Nếu đang ở trang photos và có callback onPhotoUpload, gọi callback
        if (currentPath.includes('photos/') && onPhotoUpload) {
          onPhotoUpload();
        }
      } else {
        console.error('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }

    // Reset input file để có thể upload lại cùng một ảnh
    event.target.value = '';
  };

  const handleLogout = async() =>{
    try{
      const response = await fetch(`${API_BASE_URL}/api/user/admin/logout`,
        {
          method: "POST",
          credentials: "include",
          headers:{
            "Content-Type": "application/json",
          }
        }
      );
      if(response.ok){
        onLogout();
      }else{
        console.log("Logout failed");
      }
    }catch(err){
      console.log(err);
      onLogout();
    }
  }

  const getPathDisplay = () => {
    if (!selectedUser) return null;
    
    if (currentPath.includes("photos/")) {
      return <p className="user-path-text">Photos of {selectedUser.first_name} {selectedUser.last_name}</p>;
    }
    if (currentPath.includes("users/")) {
      return <p className="user-path-text">{selectedUser.first_name} {selectedUser.last_name}</p>;
    }
    return null;
  };

  return (
    <div className="topbar-appBar">
        <div>
        <h2 variant="h5" color="inherit">
          Tran Quang Anh - B22DCCN044
        </h2>
        </div>
        <div className="topbar-right">
          {user ?(
            <>
              <div className="user-path">
                {getPathDisplay()}
              </div>
              <div className="user-info">
              <div className="user-add">
                <span className="greeting">Hi {user.first_name}</span>
                <div className="add-photo">
                  <label htmlFor="photo-upload" className="photo-upload-label">Add Photo</label>
                  <input 
                    type="file" 
                    id="photo-upload" 
                    className="photo-input" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
            </>
          ): (<div className="login-prompt">
            Please Login
          </div>)}
        </div>
    </div>
  );
}

export default TopBar;
