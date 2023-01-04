const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const facultySchema = new Schema({
    nameofFaculty: {
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
    }
    
}, {timestamps: true})

// static sign up method
facultySchema.statics.signup = async function (nameofFaculty, username, email, password) {
    
    // validation 
    if(!email || !password || !nameofFaculty || !username){
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

    const faculty = await this.create({ nameofFaculty, username, email, password:hash })

    return faculty
}   

// static login method
facultySchema.statics.login = async function (username, password){
    
    // validation 
    if(!username || !password ){
        throw Error('All fields must be filled')
    }

    const faculty = await this.findOne({ username })
    
    if(!faculty){
        throw Error('Incorrect Username')
    }

    const match = await bcrypt.compare(password, faculty.password)

    if(!match){
        throw Error('Incorrect password')
    }

    return faculty

}



module.exports = mongoose.model('faculty', facultySchema)



