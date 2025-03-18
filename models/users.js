// import { Mongoose } from "mongoose";

// Require the mongoose module 
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const userSchemaObject = {
    username: {
        type: String,
        required: true,
        unique: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      }
}

const mongooseSchema = mongoose.Schema(userSchemaObject);

module.exports = mongoose.model('User',mongooseSchema);
  
// Defining User model 
// export const User = mongoose.model('User', userSchema);