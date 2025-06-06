import React from "react";
import { Typography } from "@mui/material";

import "./styles.css";
import {useParams} from "react-router-dom";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos () {
    const user = useParams();
    return (
      <Typography variant="body1">
          Photo
      </Typography>
    );
}

export default UserPhotos;
