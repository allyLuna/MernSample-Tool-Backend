const express = require('express')
const {
    createStudent,
    getStudentsScores,
    getBelowAveStud,
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
} = require ('../controllers/studentController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()


// POST new workout // sign up -----------------
router.post('/signup-student', createStudent)

//login student
router.post('/login-student', loginStudent)
// student home
router.post('/student-home', studentHome)

// drop collection //------new
router.delete('/deleteSelection/:objectName', deleteSelection) 

// OPOST NEW SELECTION
router.post('/createSelection', selection)

// get first selected 
router.get('/selectedFirst', selectFirst)

// update a student score
router.patch('/updateScore/:username', updateStudent)

// update a student particpation frequncy
router.patch('/updateParticipation/:username', updateParticipation)

// get reults for leaderboard
router.get('/getResults', getResults)

// GET single student
router.get('/scores', getStudentsScores)

// GET all student
router.get('/takeaway/:score', getBelowAveStud)

// GET A STUDENT SCORE
router.get('/getScore/:username', getStudentScore)

// require auth for all student routes------------------- PROTECTED ROUTES ---------------------------
router.use(requireAuth)

// delete a student
router.delete('/:id', deleteStudent)




module.exports = router