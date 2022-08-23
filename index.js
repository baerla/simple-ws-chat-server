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

socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("message", (data) => {
		console.log(data);
		socketIO.emit("messageResponse", data);
	});

	socket.on("disconnect", () => {
		console.log("🔥: A user disconnected");
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
