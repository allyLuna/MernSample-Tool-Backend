
// 2 npm init -y

require('dotenv').config() // npm install dotenv

const express = require('express') // 2 require the express package npm install express
const mongoose = require('mongoose')
const studentRoutes = require('./routes/students')
const facultyRoutes = require('./routes/faculty')
const http = require("http")
const {Server} = require("socket.io")
const cors = require("cors")
const port = process.env.PORT || 3000;
//const port1 = process.env.PORT || 4001;
// express app 
const app = express()
//var server = http.createServer(app)

app.use(cors({
    origin: "https://charming-paprenjak-891a84.netlify.app"
}))

// middleware
app.use(express.json())



app.use((req,res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/students', studentRoutes)
app.use('/api/faculty', facultyRoutes)

// connect db 
mongoose.connect(process.env.MONG_URI)
    .then(() => {
        
        app.listen(port, () => {
            //console.log('connected to db & listening on port', port)
            console.log(`server is running in port ${port}`);
        })
            })
            .catch((error) => {
                console.log(error)
            })
// 3 listen to for request


    //socket server //new 12-7
 const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "https://charming-paprenjak-891a84.netlify.app",
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"]
    }});



server.listen( process.env.PORT, () => {
    console.log("Server is running");
});


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
    });
	socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message", data);
       
});
})


