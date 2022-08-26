const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

const http = require("http").createServer(app);
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const socketIO = new Server(http, {
	cors: {
		origin: "http://localhost:3000",
	},
});

let users = [];

socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("message", (data) => {
		console.log(data);
		socketIO.emit("messageResponse", data);
		socket.broadcast.emit('typingResponse', '');
	});

	socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

	socket.on('newUser', (data) => {
		//Adds the new user to the list of users
		users.push(data);
		// console.log(users);
		//Sends the list of users to the client
		socket.emit('newUserResponse', users);
	});

	socket.on("disconnect", () => {
		console.log("🔥: A user disconnected");
		//Updates the list of users when a user disconnects from the server
		users = users.filter((user) => user.socketID !== socket.id);
		// console.log(users);
		//Sends the list of users to the client
		socketIO.emit('newUserResponse', users);
		socket.disconnect();
	});
});

app.get("/api", (req, res) => {
	res.json({
		message: "Hello world",
	});
});

http.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
