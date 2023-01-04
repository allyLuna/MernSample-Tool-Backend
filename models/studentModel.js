const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const FacultySetting = require('../models/facultyModelSetting')

const Schema = mongoose.Schema

const studentSchema = new Schema({
    nameofStudent: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    score: {
        type: Number
    },
    participationAsk: {
        type: Number
    },
    participationRec: {
        type: Number
    },
    participationGive: {
        type: Number
    }
    
}, {timestamps: true})

// static sign up method
studentSchema.statics.signup = async function (nameofStudent, username, email, password) {
    
    // validation 
    if(!email || !password || !nameofStudent || !username){
        throw Error('All fields must be filled')
    }
    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }

    // check if username and email is not yet in use
    const emailExists = await this.findOne({ email })
    if(emailExists){
        throw Error('Email already in use')
    }

    const unExists = await this.findOne({ username })
    if(unExists){
        throw Error('Username already in use')
    }

    //password hashing npm install bcrypt
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const student = await this.create({ nameofStudent, username, email, password:hash })

    return student
}   

// static login method
studentSchema.statics.login = async function (username, password){
    
    // validation 
    if(!username || !password ){
        throw Error('All fields must be filled')
    }

    const student = await this.findOne({ username })
    
    if(!student){
        throw Error('Incorrect Username')
    }

    const match = await bcrypt.compare(password, student.password)

    if(!match){
        throw Error('Incorrect password')
    }

    return student

}




module.exports = mongoose.model('student', studentSchema)



