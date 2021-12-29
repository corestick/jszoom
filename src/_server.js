import express from "express";
import WebSocket from "ws";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http:localhost:3000`);
//app.listen(3000, handleListen);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // http, websocket 서버 둘다 생성

const sockets = [];

wss.on("connection", (socket) => {
	sockets.push(socket);
	socket["nickname"] = "Anon";
	console.log("Connected to Browser");
	socket.on("close", () => console.log("Disconnected from the Browser"));
	socket.on("message", (msg) => {
		const message = JSON.parse(msg);
		switch (message.type) {
			case "new_message":
				sockets.forEach((aSocket) =>
					aSocket.send(`${socket.nickname}: ${message.payload}`)
				);
				break;
			case "nickname":
				socket["nickname"] = message.payload;
				break;
		}
	});
});

server.listen(3000, handleListen);