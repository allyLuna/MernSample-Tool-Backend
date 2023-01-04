const express = require('express')
const {
    createFaculty,
    loginFaculty,
    createSession,
    getReward,
    facDash
} = require ('../controllers/facultyController')

const requireAuthFaculty = require('../middleware/requireAuthFaculty')

const router = express.Router()


// POST new workout // sign up -----------------
router.post('/signup-faculty', createFaculty)

//login student
router.post('/login-faculty', loginFaculty)

// get reward
router.get('/getReward/:class_Code', getReward)

// get reward
router.get('/facdash', facDash)

// require auth for all student routes------------------- PROTECTED ROUTES ---------------------------
router.use(requireAuthFaculty)

// settings
router.post('/faculty-home', createSession)



module.exports = router