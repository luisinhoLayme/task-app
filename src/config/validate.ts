import mongoose from "mongoose";

export const validate = {

  isMongoID: ( id: string ) => {
    return mongoose.isValidObjectId(id)
  },

  email: (email: string) => {
    const emailRegex = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (emailRegex.test(email)) return true
    else return false
  },

  passwordComplex: (password: string) => {
    //Should have 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long
    const passwordRegex = /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/
    if (passwordRegex.test(password)) console.log('password válido')
    else console.log('password incorrecto')
  },

  passwordModerate: (password: string) => {
    //Should have 1 lowercase letter, 1 uppercase letter, 1 number, and be at least 8 characters long
    const passwordRegex = /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$/
    if (passwordRegex.test(password)) return true
    else return false
  },

  username: (username: string) => {
    //Alphanumeric string that may include _ and – having a length of 3 to 16 characters –
    const usernameRegex = /^[a-z0-9_-]{3,16}$/
    if (usernameRegex.test(username)) return true
    else return false
  },

  name: (name: string) => {
    //Alphanumeric string that may include _ and – having a length of 3 to 16 characters –
    const usernameRegex = /^[A-Za-z\s]{3,16}$/
    if (usernameRegex.test(name)) return true
    else return false
  },
}
