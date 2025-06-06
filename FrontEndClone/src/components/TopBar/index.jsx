import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import {API_BASE_URL} from "../../config";
import "./styles.css";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar ({user,onLogout}) {
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
    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit">
            Tran Quang Anh - B22DCCN044
          </Typography>
          <div className="topbar-right">
            {user ?(
              <>
                <div className="user-info">
                <span className="greeting">Hi {user.first_name}</span>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
              </>
            ): (<span className="login-prompt">Please Login</span>)}
          </div>
        </Toolbar>
      </AppBar>
    );
}

export default TopBar;
