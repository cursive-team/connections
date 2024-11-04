import { WebSocket } from 'ws';
import { wsServer } from "@/index";

wsServer.on('connection', (socket: WebSocket) => {

  socket.on('open', () => {
    console.log("Open ws client connection");
  });

  socket.on('message', async () => {
    console.log("Receive message");
  });

  socket.on('close', () => {
    console.log(`Close ws client connection`);
  });

});