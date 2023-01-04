const mongoose = require('mongoose')

const Schema = mongoose.Schema

const facultySettingSchema = new Schema({
    class_Name: {
        type: String,
        required: true
    },
    class_Code: {
        type: String,
        required: true
    },
    class_Reward: {
        type: String,
        required: true
    },
    faculty_id: {
        type: String,
        required: true
    }
}, {timestamps: true})

facultySettingSchema.statics.sessionCreate = async function (class_Name, class_Code, class_Reward, faculty_id) {
   

    // validation 
    if(!class_Name || !class_Code || !class_Reward){
        throw Error('All fields must be filled')
    }
    
    // check if username and email is not yet in use
    const classExists = await this.findOne({ class_Name })
    if(classExists){
        throw Error('Class already Exists')
    }

    const codeExists = await this.findOne({ class_Code })
    if(codeExists){
        throw Error('Code is already in use')
    }

    const session = await this.create({class_Name, class_Code, class_Reward, faculty_id})

    return session
}   

facultySettingSchema.statics.enterSession = async function (class_Code) {
// validation 
if(!class_Code ){
    throw Error('Please Enter Session Code')
}

const session = await this.findOne({ class_Code })

if(!session){
    throw Error('Incorrect Session Code')
}

return session
}
module.exports = mongoose.model('session', facultySettingSchema)



