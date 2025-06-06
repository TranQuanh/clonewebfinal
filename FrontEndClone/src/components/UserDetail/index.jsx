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
        try{
            const fetchUser = async () => {
                console.log(`${API_BASE_URL}/api/user/${userId}`);
                const response = await fetch(`${API_BASE_URL}/api/user/${userId}`,
                  {
                    method: "GET",
                    credentials: "include",
                  }
                );
                if(response.ok){
                    const data = await response.json();
                    setUser(data);
                    console.log(user);
                }else{
                    console.error("Failed to fetch user detail");
                }
            };
            fetchUser();
        }catch(err){
            console.error("Error fetching user detail:", err);
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
