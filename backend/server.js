require('dotenv').config(); // import the config file 

const express = require('express');//imports the express framework
const http = require('http');//import http module from nodejs
const socketIo = require('socket.io');//import socket.io which enables RTC(RealTimeCommunication) between clients and a server
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
//importing routers
const userRouter = require('./Routes/userRoutes')
const taskRouter= require('./Routes/taskRoutes')
const projectRouter = require('./Routes/projectRoutes')
const leaveRouter = require('./Routes/leaveRoutes')
const notifRouter = require('./Routes/notificationRoutes')
const messagesRouter = require('./Routes/messagesRoute')
//import middleware
const { errorHandler} = require('./Middleware/errorMiddleware')
//import addMessage from controller it's all in the back better than using the api in the front
const {createMessage} = require('./Controllers/messagesController')

const app = express();//create express app

const server = http.createServer(app);//create http server
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity, but you should restrict this in production
    /*              cors(CrossOrigineResourceSharing) (*)===>let anyone within the netwrok to connect to the server   */
  }
});

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD','DELETE'],
  credentials: true
}));

// middleware
app.use(express.json()) // instead of using body parser 

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})
app.use(cookieParser())
// routes
app.use('/api/auth',userRouter)
app.use('/api/messages',messagesRouter);
app.use('/api/task',taskRouter)
app.use('/api/projects',projectRouter)
app.use('/api/leave',leaveRouter)
app.use('/api/notification',notifRouter);



mongoose.connect(process.env.MONGO_URI)
.then( () => {
  console.log("connected to db");
  // listen for requests
  app.listen(process.env.PORT, () => {
    console.log('listening on port', process.env.PORT||4000)
  })
 }
)
.catch(
  (err) => console.log(err)
);
io.on('connection', async (socket) => { 
  console.log('a user connected:', socket.id);
  socket.on('disconnect', () => {//same thing
    io.emit('user-left', socket.id);
    console.log('a user disconnected', socket.id);
  });
  socket.on('join-room', (userId, roomId) => {
    // Join the room
    socket.join(roomId);
  
    // Broadcast to all other clients in the room except the sender
    socket.to(roomId).emit('user-joined', userId);
    
    console.log('user:', userId, 'joined room', roomId);
  });
  socket.on('chat message', async (msg) => {
    try {
        await createMessage(msg);
        io.emit('chat message', msg); // Emit the saved message
    } catch (error) {
        console.error('Error sending message:', error);
        // Handle the error {ya men 7yé}
    }
});
});
const PORT = process.env.PORT || 4000;//sets port for the server to listen events on
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));//once server is listening or is running we log a message