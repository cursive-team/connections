import { Server, Socket } from "socket.io";
import { server } from "@/index";

export const wsServer = new Server(server);

wsServer.on('connection', (socket: Socket) => {
  socket.on('disconnect', () => {
    console.log(`Disconnect ws client connection`);
  });

  socket.on('message', async (message: string) => {
    console.log("Received websocket message");
  });
});