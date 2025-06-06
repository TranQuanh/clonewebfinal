const mongoose = require("mongoose");

require("dotenv").config();

const User = require("./userModel.js");
const Photo = require("./photoModel.js");
const SchemaInfo = require("./schemaInfo.js");

const model = require("../modelData/models.js");

const versionString = "1.0";

async function dbLoad(){
  try{
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");
  }catch(error){
    console.log("Unable connect to MongoDB");
  }

  await SchemaInfo.deleteMany({});
  await Photo.deleteMany({});
  await User.deleteMany({});

  const userModels = model.userListModel();
  const makeFake2RealID = {};
  for(const user of userModels){
    const userObject = new User(
      {
        first_name: user.first_name,
        last_name: user.last_name,
        location: user.location,
        description: user.description,
        occupation: user.occupation,
        login_name: user.login_name,
        password: user.password,

      }
    );
    try{
      await userObject.save();
      makeFake2RealID[user._id] = userObject._id;
      user.objectID = userObject._id;
      console.log(
        "Adding user: ",
        user.first_name,
        " ",
        user.last_name,
        "With ID: ",
        user.objectID
      );
    }
    catch(error){
      console.log("Error adding user: ", error);
    }
  }

  // photo
  const photoModels = [];
  const userSID = Object.keys(makeFake2RealID);
  userSID.forEach((id) => photoModels.push(...model.photoOfUserModel(id)));
  for(const photo of photoModels){
    const photoObject = new Photo({
      file_name: photo.file_name,
      date_time: photo.date_time,
      user_id: makeFake2RealID[photo.user_id],
    });
    photo.ObjectID = photoObject._id;
    if(photo.comments){
      photo.comments.forEach(function(comment){
        photoObject.comments = photoObject.comments.concat([
          {
            comment: comment.comment,
            date_time: comment.date_time,
            user_id: comment.user.objectID,
          }
        ]);
        console.log(
          "Adding comment of length %d by user %s to photo %s",
          comment.comment.length,
          comment.user.objectID,
          photo.file_name,
        );
      }); 
    }
    try{
      await photoObject.save();
      console.log(
        "Adding photo: ",
        photo.file_name,
        "of user ID:",
        photoObject.user_id,
      )
    }
    catch(error){
      console.log("Error adding photo: ", error);
    }
  }
  try{
    schemaInfo = await SchemaInfo.create({
      version: versionString,
    });
    console.log("SchemaInfo added");
  }
  catch(error){
    console.log("Error adding SchemaInfo: ", error);
  }
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");



}



dbLoad();