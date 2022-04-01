const express = require("express");
const path = require("path");
const http = require("http");
const { Server, Socket } = require("socket.io");

const port = 3000;

class App {
  constructor(port) {
    this.clients = {};
    this.port = port;
    const app = express();
    app.use(express.static(path.join(__dirname, "../client")));

    this.server = new http.Server(app);

    this.io = new Server(this.server);

    this.io.on("connection", (socket) => {
      console.log("SOCKET", socket);
      console.log(socket.constructor.name);
      this.clients[socket.id] = {};
      console.log(this.clients);
      console.log("a user connected : " + socket.id);
      socket.emit("id", socket.id);

      socket.on("disconnect", () => {
        console.log("socket disconnected : " + socket.id);
        if (this.clients && this.clients[socket.id]) {
          console.log("deleting " + socket.id);
          delete this.clients[socket.id];
          this.io.emit("removeClient", socket.id);
        }
      });

      socket.on("update", (message) => {
        if (this.clients[socket.id]) {
          this.clients[socket.id].t = message.t; //client timestamp
          this.clients[socket.id].position = message.p; //position
          this.clients[socket.id].rotation = message.r; //rotation
          this.clients[socket.id].animationIndex = message.i; //rotation
        }
      });
    });

    setInterval(() => {
      this.io.emit("clients", this.clients);
    }, 50);
  }

  Start() {
    this.server.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}.`);
    });
  }
}

new App(port).Start();
