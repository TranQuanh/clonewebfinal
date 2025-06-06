const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const {request, response} = require("express");
const mongoose = require("mongoose");
function requireAuth(request, response, next){    
    console.log("=== AUTH CHECK ===");
    console.log("Session ID: ", request.session.id);
    console.log("Session UserId: ",request.session.userID);
    console.log("Full session",request.session);
    console.log("Cookies:", request.headers.cookie);
    console.log("====================")

    if(!request.session.userID){
        return response.status(401).json({error: "Unauthorized - No session"});
    }
    next();
}

router.post("/admin/login",async(request,response)=>{
    const {login_name,password} = request.body;
    if(!login_name || !password){
        return response.status(400).json({error: "Missing login_name or password"});
    }
    try{
        const user = await User.findOne({login_name: login_name});
        if(!user || user.password !== password){
            return response.status(400).json({error: "Invalid login_name or password"});
        }
        request.session.userID = user._id;
        console.log("Logged in user_id: ", request.session.userID);
        response.status(200).json({
            _id: user._id,
            login_name: user.login_name,
            first_name: user.first_name,
            last_name: user.last_name,
        });
    }catch(error){
        console.log("Error in login: ", error);
        return response.status(500).json({error: "Internal server error"});
    }
});

router.post("/register",async(request,reponse)=>{
        const{
            login_name,
            password,
            first_name,
            last_name,
            location,
            description,
            occupation,
        } = request.body;
        if (!login_name || !password ||!first_name|| !last_name){
            return reponse.status(400).json({error: "Missing login name,password,firsts name of last name"});;
        }
        try{
            const existingUser = await User.findOne({login_name: login_name});
            if(existingUser){
                return reponse.status(400).json({error:"User already exists"});
            }
            const newUser = new User({
                login_name:login_name,
                password: password,
                first_name: first_name,
                last_name: last_name,
                location: location || "",
                description: description ||"",
            });
            console.log(newUser);
            await newUser.save();
            reponse.status(200).json({message: "User registered successfully",
                _id: newUser._id,
                login_name: newUser.login_name,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
            });
        } catch (error) {
            console.log("Error in register: ", error);
            return reponse.status(500).json({error: "Internal server error"});
        }
});

router.post("/admin/logout", async(request,response)=>{
    if(!request.session.userID){
        return response.status(401).json({error: "Unauthorized - No session"});
    }
    const userId = request.session.userID;
    request.session.destroy((error)=>{
        if(error){
            return response.status(500).json({error: "Error logging out"});
        }
        console.log("Logged out user_id: ", userId);
        response.clearCookie("connect.sid");
        return response.status(200).json({message:"log out successfully"});
    });
});
router.get("/list",requireAuth,async(request,response)=>{
    try{
        const users = await User.find({},"_id first_name last_name");
        return response.status(200).json(users);
    }catch(error){
        return response.status(500).json({error:"Internal server error"});
    }
});
router.get("/:id",requireAuth,async(request,response)=>{
    const id = request.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return response.status(404).json({error: "Invalid user ID"});
    }
    try{
        const user = await User.findById(id,"_id first_name last_name location description occupation");
        if(!user){
            return response.status(404).json({error:"User not found"});
        }
        return response.status(200).json(user);
    }catch(error){
        return response.status(500).json({error: "Internal server error"});
    }
});

router.get("/check-session", async (request, response) => {
    if (!request.session.userID) {
        return response.status(401).json({ error: "No active session" });
    }
    try {
        const user = await User.findById(request.session.userID);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }
        return response.status(200).json({
            _id: user._id,
            login_name: user.login_name,
            first_name: user.first_name,
            last_name: user.last_name,
        });
    } catch (error) {
        console.error("Session check error:", error);
        return response.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;