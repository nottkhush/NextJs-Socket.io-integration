const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

/*
  Spinning up an Express app.
  This handles basic HTTP stuff and also acts as the base
  for my Socket.IO server.
*/
const app = express();

/*
  Letting Express understand JSON bodies,
  because I’m sending messages via POST requests too.
*/
app.use(express.json());

/*
  Wrapping Express in an HTTP server so Socket.IO
  can hook into the same server instance.
*/
const server = http.createServer(app);

/*
  CORS setup so my frontend on localhost:3000
  doesn’t get blocked for existing.
*/
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

/*
  Initializing Socket.IO and telling it
  which frontend is allowed to connect.
*/
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

/*
  This fires every time a new user connects via socket.
  Socket.IO gives me a unique socket.id for each client,
  which is super useful for debugging and tracking users.
*/
io.on("connection", (socket) => {
  console.log("User connected with ID: " + socket.id);

  /*
    Listening for messages sent from the frontend.
    Right now I’m just logging them,
    but this is where I could add DB storage,
    auth checks, or whatever later.
  */
  socket.on("sendMessage", (Message) => {
    console.log("Message received: " + Message);
  });

  /*
    Runs when the user disconnects
    (closing tab, refreshing, rage quitting, etc).
  */
  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

/*
  This is a regular HTTP endpoint.
  I use it to take a message from a POST request
  and then broadcast it to all connected socket clients.
*/
app.post("/reply", (req, res) => {
  const { message } = req.body;

  /*
    Emitting this message to everyone connected.
    The frontend is listening for "receiveMessage",
    so it instantly shows up in the chat UI.
  */
  io.emit("receiveMessage", message);

  res.status(200).send({ Success: true });
});

/*
  Finally starting the server.
  Both Express and Socket.IO are now live on port 4000.
*/
server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
