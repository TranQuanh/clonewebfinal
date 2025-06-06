import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

import "./styles.css";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos({ photoUpdateTrigger }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [comment, setComment] = useState("");

  const fetchPhotos = async () => {
    try {
      console.log("Fetching photos...");
      const response = await fetch(
        `${API_BASE_URL}/api/photo/photoOfUser/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Received data from API:", data);
        setPhotos(data);
      } else {
        console.error("Failed to fetch photos");
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered, fetching photos...");
    fetchPhotos();
  }, [userId, photoUpdateTrigger]);

  const handleAddComment = async (photoId) => {
    if (!comment.trim()) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/photo/commentOfPhoto/${photoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: comment,
          }),
          credentials: "include",
        }
      );
      if (response.ok) {
        setComment("");
        await fetchPhotos();
      } else {
        console.error("Failed to add comment");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="user-photo">
        <div className="photo-grid">
          {photos.length > 0 ? (
            photos.map((photo) => (
              <div key={photo._id} className="photo-item">
                <div className="photo-image">
                  <img
                    src={`${API_BASE_URL}/images/${photo.file_name}`}
                    alt={photo.file_name}
                    style={{ width: "100%", maxWidth: "400px" }}
                  />
                </div>
                <div className="photo-date">
                  {new Date(photo.date_time).toLocaleString()}
                </div>
                <div className="comment-space">
                  <div className="comment-headline">Comments:</div>
                  <div className="comment-input">
                    <label>Your comment:</label>
                    <input
                      type="text"
                      name="comment"
                      value={comment}
                      placeholder="Add a comment..."
                      onChange={(e) => setComment(e.target.value)}
                      className="form-field full-width"
                    />
                    <button
                      className="btn comment-button"
                      onClick={() => handleAddComment(photo._id)}
                    >
                      Add Comment
                    </button>
                  </div>
                  <div className="comment-list">
                    {photo.comments &&
                      photo.comments.length > 0 &&
                      photo.comments.map((comment) => (
                        <div key={comment._id} className="comment-item">
                          <div className="comment-gr">
                            <div className="comment-author">
                              <Link to={`/users/${comment.user._id}`}>
                                {comment.user.first_name}{" "}
                                {comment.user.last_name}
                              </Link>
                            </div>
                            <div className="comment-date">
                              {new Date(comment.date_time).toLocaleString()}
                            </div>
                          </div>
                          <div className="comment-content">
                            {comment.comment}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-photos">No photos found</div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserPhotos;
