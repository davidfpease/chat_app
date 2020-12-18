const express = require("express");
const app = express();
const db = require('./config/keys').mongoURI;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");

const connect = mongoose
.connect(db, { useNewUrlParser: true })
.then(() => console.log("Connected to MongoDB successfully"))
.catch(err => console.log("DB error: " + err));


const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: '*',  //added this due to CORS error
  }
});


const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);

// const cors = require('cors');
// // app.use(cors({
// //   origin: "*",
// // }));
// app.use(cors());


app.use("/api/users", users);
app.use("/api/tweets", tweets);

//const socket = require("socket.io");


let members = [];
const messages = {
  general: [],
  random: [],
}

io.on("connection", socket => {
//debugger;
  console.log("Connection made from socket id: " + socket.id);

  socket.on("join server", (username) => {
    debugger;

    const member = {
      username,
      id: socket.id,
    }
    //update database with a user's login rather than saving in the users array?
    members.push(member);
    io.emit("new member", members);
  });

  socket.on("join room", (roomName, callback) => {
    socket.join(roomName);
    console.log(`Room ${roomName} joined under socket id : ${socket.id}`);
    //callback(messages[roomName]);  // get messages that were already in the room
  });

  socket.on("send message", ({ content, to, sender, chatName, isChannel })=>{
    if (isChannel) {
      const payload = {
        content, 
        chatName,
        sender,
      };
      
      debugger;
      //save message to db here?
      //to is the room name or a unique socket id
      io.to(to).emit("new message", payload);
    }

    //add message to messages object
    if (messages[chatName]){
      messages[chatName].push({
        sender,
        content,
      })
    };
  });

  socket.on("disconnect", ()=>{
    members = members.filter(mem => mem.id !== socket.id);
    io.emit("new member")
  })




});

const port = process.env.PORT || 5000;
//app.listen(port, () => console.log(`Server is running on port ${port}`));
//changed app.listen to server.listen in order to enable socket.io
// reference: https://blog.crowdbotics.com/build-chat-app-with-nodejs-socket-io/

server.listen(port, () => console.log(`Server is running on port ${port}`));