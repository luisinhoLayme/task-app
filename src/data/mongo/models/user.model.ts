import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is Required']
  },
  email: {
    type: String,
    required: [true, 'Email is Required']
  },
  password: {
    type: String,
    required: [true, 'Password is Required']
  },
  validateEmail: {
    type: Boolean,
    default: false
  }
})

export const UserModel = mongoose.model('User', userSchema)
