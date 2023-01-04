const mongoose = require('mongoose')

const Schema = mongoose.Schema

const selectionSchema = new Schema({
    student_uname: {
        type: String,
        required: true
    },
    eventTimestamp: {
        type: String,
        required: true
    },
    objectName: {
        type: String,
        required: true
    }
}, {timestamps: true})

selectionSchema.statics.selectionCreate = async function (student_uname, eventTimestamp, objectName) {
   

    // validation 
    if(!student_uname || !eventTimestamp || !objectName){
        throw Error('All fields must be filled')
    }
    
    // check if username and email is not yet in use
    const unameExists = await this.findOne({ student_uname })
    if(unameExists){
        throw Error('Student already Exists')
    }


    const selection = await this.create({student_uname, eventTimestamp, objectName})

    return selection
}   


module.exports = mongoose.model('selection', selectionSchema)



