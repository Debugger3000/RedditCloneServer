
// Require the mongoose module 
import mongoose from 'mongoose';

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

const userSchema = mongoose.Schema(userSchemaObject);

const User = mongoose.model('User',userSchema);

export {User, userSchema}
  
// Defining User model 
// export const User = mongoose.model('User', userSchema);