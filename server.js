// 2 npm init -y

require('dotenv').config() // npm install dotenv

const express = require('express') // 2 require the express package npm install express
const mongoose = require('mongoose')
const studentRoutes = require('./routes/students')
const facultyRoutes = require('./routes/faculty')
const https = require('node:https')
const {Server} = require("socket.io")
const port = process.env.PORT || 4000;
const serverTiming = require('server-timing')
// express app 
const app = express()

//cors origin is the client that we allow
const cors = require("cors")
app.use(cors({origin: 'https://charming-paprenjak-891a84.netlify.app'}))

// middleware
app.use(express.json())
app.use(serverTiming())

app.use((req,res, next) => {
    console.log(req.path, req.method)
    res.startTime('file', 'File IO metric');
  setTimeout(() => {
    res.endTime('file');
  }, 100);
    next()
})
app.use((req, res, next) => {
    // you can see test end time response
    res.startTime('test', 'forget to call endTime');
    next();
  });
  app.use((req, res, next) => {
    // All timings should be in milliseconds (s). See issue #9 (https://github.com/yosuke-furukawa/server-timing/issues/9).
    res.setMetric('db', 100.0, 'Database metric');
    res.setMetric('api', 200.0, 'HTTP/API metric');
    res.setMetric('cache', 300.0, 'cache metric');
    next();
  });

// routes
app.use('/api/students', studentRoutes)
app.use('/api/faculty', facultyRoutes)


const server = https.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "https://charming-paprenjak-891a84.netlify.app",
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"]
    }});

// connect db 
mongoose.connect(process.env.MONG_URI)
    .then(() => {
        server.listen(port, () => {
            console.log('connected to db & listening on port', process.env.PORT);
        })
    })
        .catch(error => {
            console.log('error', error);	
        });
    
// 3 listen to for request
/*app.listen(process.env.PORT, () => {
    console.log('connected to db & listening on port', process.env.PORT)
})
    })
    .catch((error) => {
        console.log(error)
    })*/

    //socket server //new 12-7


/*server.listen( app, () => {
    console.log("Server is running");
});*/


io.on("connection", (socket) => {
   
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
    });
	socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message", data);
       
});

})