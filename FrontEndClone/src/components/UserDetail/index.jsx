import React, {useState, useEffect} from "react";
import {Typography} from "@mui/material";
import {API_BASE_URL} from "../../config";
import "./styles.css";
import {useParams} from "react-router-dom";
import {Link} from "react-router-dom";
/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
    const {userId} = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        if (userId) {
            fetchUserDetail();
        }
    }, [userId]);

    return (
        <div className="user-detail-wrapper">
            {user &&(
                <div className="user-detail">
                    <div className="user-name">{user.first_name} {user.last_name}</div>
                    <div className="user-info">
                        <div><strong> Location:</strong> {user.location || 'Not specified'}</div>
                        <div><strong> Occupation:</strong> {user.occupation || 'Not specified'}</div>
                        <div><strong> Description:</strong> {user.description || 'No description available'}</div>
                    </div>
                    <Link to={`/photos/${user._id}`}>
                        <div className="btn photo-button">
                            <p>See Photos</p>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default UserDetail;
