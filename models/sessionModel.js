

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const sessionCodeSchema = new Schema({
    session_Code: {
        type: String,
        required: true
    }})

    sessionCodeSchema.statics.enterSession = async function (session_Code) {
   
    // validation 
    if(!session_Code ){
        throw Error('Please Enter Session Code')
    }

    const session = await this.findOne({ session_Code })
    
    if(!session){
        throw Error('Incorrect Session Code')
    }

    return session
}   


module.exports = mongoose.model('sessionCode', sessionCodeSchema)



