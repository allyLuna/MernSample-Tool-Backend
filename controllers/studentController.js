const Student = require ('../models/studentModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const FacultySetting = require('../models/facultyModelSetting')
const Selection = require('../models/selectionModel')

const createToken = (_id) => {
   return jwt.sign({_id}, process.env.SECRET, {expiresIn:'3d'}) 
}


// get specific student score
const getStudentScore = async (req, res) => {
    const {username} = req.params
   // const {score} = req.params
     const students = await Student.find({username}, {score: 1})
    
     res.status(200).json(students)
 }

// get student below average
const getBelowAveStud = async (req, res) => {
    
   const {score} = req.params
    const students = await Student.find({score: {$lt:score}})
   
    res.status(200).json(students)
}

// get students scores
const getStudentsScores = async (req, res) => {
    const results = await Student.find({}, {score: 1})

   res.status(200).json(results)

}

// delete a student
const deleteStudent = async (req, res) =>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such student'})
    }

    const student = await Student.findOneAndDelete({_id: id})

    if (!student){
        return res.status(404).json({error: 'no such student'})
    }

    res.status(200).json(student)
}

// update a student score -- NEW
const updateStudent = async (req, res) => {
    const {username} = req.params
    const {score} = req.body
    
    const unExists = await Student.findOne({ username })
    if(!unExists){
        return res.status(404).json({error: 'No such student'})
    }

  
    const student = await Student.findOneAndUpdate({username}, {score})
    
    res.status(200).json(username + " score is updated: " + score )
    
}

// update a student participation -- NEW
const updateParticipation = async (req, res) => {
    const {username} = req.params
    const {participationAsk, participationRec, participationGive} = req.body

    const unExists = await Student.findOne({ username })
    if(!unExists){
        return res.status(404).json({error: 'No such student'})
    }
    const student = await Student.updateMany({username}, ({participationAsk, participationGive, participationRec}))
    //const hatdog = await Student.updateMany({username}, ({participationAsk, participationGive, participationRec}))
    
    res.status(200).json(username + " Participation Frequency is updated: "  + participationAsk + " " + participationRec + " " + participationGive)
    
}

//------------------------ SIGN UP AND LOGIN -----------------------

// create new student -- sign up user
const createStudent = async (req, res) => {
    const {nameofStudent, username, email, password} = req.body
   
    // add doct to db
   try{
    //const student = await Student.create({nameofStudent, username, email, password})
    // res.status(200).json(student)
    const student = await Student.signup(nameofStudent, username, email, password)
    
    //create token
    const token = createToken(student._id)

    res.status(200).json({nameofStudent, username, email, password, token})
   } catch (error){
    res.status(400).json({error: error.message})
   }
}

const loginStudent = async (req, res) => {
    const{username, password} = req.body

    try{
        
        const student = await Student.login(username, password)
        
        //create token
        const token = createToken(student._id)
    
        res.status(200).json({username, token})
       } catch (error){
        res.status(400).json({error: error.message})
       }

}

//------------------------ SESSION AND SELECTION -----------------------
// get a a session code something
const studentHome = async (req, res) => {
    const{class_Code} = req.body

    try{
        
        const session = await FacultySetting.enterSession(class_Code)
        //create token
        const token = createToken(session._id)
    
    
        res.status(200).json({class_Code, token})
       } catch (error){
        res.status(400).json({error: error.message})
       }
    
}

//storing of current
const selection = async (req, res) => {
    const {student_uname, eventTimestamp, objectName} = req.body
   
    // add doct to db
   try{
    
    //const student_id = req.student._id
    const selection = await Selection.selectionCreate(student_uname, eventTimestamp, objectName)
    
    res.status(200).json(selection)
   } catch (error){
    res.status(400).json({error: error.message})
   }
}

//deleting selection
const deleteSelection = async (req, res) => {
   
        const {objectName} = req.params
    
        if(!(objectName)) {
            return res.status(404).json({error: 'No such input'})
        }
    
        const student = await Selection.deleteMany({_objectName: objectName})
    
        
    
        res.status(200).json(student)
}

// get the first timestamp

const selectFirst = async (req, res) => {
   
    const selected = await Selection.findOne({}).sort({createdAt: 1})

    res.status(200).json(selected)
 }
 
 // getting results for leaderboard
 const getResults = async (req, res) => {

   const results = await Student.find({}).sort({score:-1}).limit(3)

   res.status(200).json(results)

 }

module.exports = {
    getStudentsScores,
    getBelowAveStud,
    createStudent,
    deleteStudent,
    updateStudent,
    loginStudent,
    studentHome,
    selection,
    deleteSelection,
    selectFirst,
    getResults,
    updateParticipation,
    getStudentScore
}