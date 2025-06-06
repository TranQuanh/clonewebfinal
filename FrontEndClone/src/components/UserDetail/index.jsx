import React from "react";
import {Typography} from "@mui/material";

import "./styles.css";
import {useParams} from "react-router-dom";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
    const user = useParams();
    return (
        <>
          <Typography variant="body1">
            User Detail
          </Typography>
        </>
    );
}

export default UserDetail;
