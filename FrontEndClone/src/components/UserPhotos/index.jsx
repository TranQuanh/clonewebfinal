import React, { useEffect, useState } from "react";
import { Typography, Divider, TextField, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import "./styles.css";

function UserPhotos() {
  //Hien thi anh
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/photo/photosOfUser/${userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      }
    }
    if (userId) {
      fetchPhotos();
    }
  }, [userId]);

  //add comment
  const [commentInput, setCommentInput] = useState({});

  const handleCommentChange = (photoId, value) => {
    setCommentInput((prev) => ({ ...prev, [photoId]: value }));
  };

  const handleCommentSubmit = async (photoId) => {
    const comment = commentInput[photoId]?.trim();
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/photo/commentsOfPhoto/${photoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ comment }),
        }
      );
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to add comment.");
      }
      const updatedPhotos = await fetch(
        `${API_BASE_URL}/api/photo/photosOfUser/${userId}`,
        {
          credentials: "include",
        }
      ).then((response) => response.json());
      setPhotos(updatedPhotos);
      setCommentInput((prev) => ({ ...prev, [photoId]: "" }));
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="user-photos">
      {photos.map((photo) => (
        <div key={photo._id} className="photo-block">
          <img
            src={`${API_BASE_URL}/images/${photo.file_name}`}
            alt="user"
            style={{ width: "100%", maxWidth: "400px" }}
          />
          <Typography variant="body2" color="textSecondary">
            {new Date(photo.date_time).toLocaleString()}
          </Typography>

          {/*ô comment*/}
          <div className="comment-input" style={{ marginTop: "10px" }}>
            <TextField
              label="Add a comment"
              variant="outlined"
              size="small"
              fullWidth
              value={commentInput[photo._id] || ""}
              onChange={(e) => handleCommentChange(photo._id, e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "5px" }}
              onClick={() => handleCommentSubmit(photo._id)}
            >
              Submit
            </Button>
          </div>

          {/*hiển thị comment*/}
          {photo.comments && photo.comments.length > 0 && (
            <div className="comments-section" style={{ marginTop: "10px" }}>
              <Typography variant="subtitle1">Comments:</Typography>
              {photo.comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <Typography variant="body2">
                    <strong>
                      {comment.user?.first_name} {comment.user?.last_name}:
                    </strong>{" "}
                    {comment.comment}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(comment.date_time).toLocaleString()}
                  </Typography>
                  <Divider style={{ margin: "5px 0" }} />
                </div>
              ))}
            </div>
          )}

          <Divider style={{ margin: "20px 0" }} />
        </div>
      ))}
    </div>
  );
}

export default UserPhotos;
