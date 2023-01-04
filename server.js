
// 2 npm init -y

require('dotenv').config() // npm install dotenv

const express = require('express') // 2 require the express package npm install express
const mongoose = require('mongoose')
const studentRoutes = require('./routes/students')
const facultyRoutes = require('./routes/faculty')
const http = require("http")
const {Server} = require("socket.io")
const port = process.env.PORT || 4000;
// express app 
const app = express()

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
        

// 3 listen to for request
app.listen(port, () => {
    console.log('connected to db & listening on port', {port})
})
    })
    .catch((error) => {
        console.log(error)
    })

    //socket server //new 12-7
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

server.listen( 4001, () => {
    console.log("Server is running");
});


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
    });
	socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message", data);
        //socket.to(data.room).emit("receive_message", data);
        //socket.to(data.room).emit("receive_message", data);
       // console.log(data.room)
});
})


