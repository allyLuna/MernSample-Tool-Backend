const Faculty = require ('../models/facultyModel')
const FacultySetting = require('../models/facultyModelSetting')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Student = require ('../models/studentModel')

const createToken = (_id) => {
   return jwt.sign({_id}, process.env.SECRET, {expiresIn:'3d'}) 
}


//------------------------ SIGN UP AND LOGIN -----------------------

// create new faculty -- sign up user
const createFaculty = async (req, res) => {
    const {nameofFaculty, username, email, password} = req.body
   
    // add doct to db
   try{
   
    const faculty = await Faculty.signup(nameofFaculty, username, email, password)
    
    //create token
    const token = createToken(faculty._id)

    res.status(200).json({nameofFaculty, username, email, password, token})
   } catch (error){
    res.status(400).json({error: error.message})
   }
}

const loginFaculty = async (req, res) => {
    const{username, password} = req.body

    try{
        
        const faculty = await Faculty.login(username, password)
        
        //create token
        const token = createToken(faculty._id)
    
        res.status(200).json({username, token})
       } catch (error){
        res.status(400).json({error: error.message})
       }

}


// for the settings of the session
const createSession = async (req, res) => {
    const {class_Name, class_Code, class_Reward} = req.body
  
    // add doc to db
    try {

      const faculty_id = req.faculty._id
      const session = await FacultySetting.sessionCreate(class_Name, class_Code, class_Reward, faculty_id)
      res.status(200).json(session)
    } catch (error) {
      res.status(400).json({error: error.message})
    }
  }

//for getting reward
const getReward = async (req, res) => {
    
  const {class_Code} = req.params
   const students = await FacultySetting.find({class_Code}, {class_Reward: 1})
  
   res.status(200).json(students)
}

// faculty dash
// get specific student score
const facDash = async (req, res) => {
  const {username} = req.params
 // const {score} = req.params
   const students = await Student.find({},{username:1, score: 1, participationAsk:1, participationGive:1, participationRec:1})
  
   res.status(200).json(students)
}

module.exports = {
    createFaculty,
    loginFaculty,
    createSession,
    getReward,
    facDash
}