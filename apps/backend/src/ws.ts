import { WebSocket } from 'ws';
import {
  WebSocketRequestTypes,
  WebSocketRequest,
  WebSocketRequestSchema,
  WebSocketResponseTypes,
  WebSocketResponse,
  WebSocketErrorPayload,
  MapRequestToResponse,
  errorToString
} from "@types";
import { Controller } from "@/lib/controller";

import { wsServer } from "@/index";

const controller = new Controller();

const clientsSockets: Record<string, WebSocket> = {};

const handleError = (socket: WebSocket, target: string, error: string): void => {
  const payload: WebSocketErrorPayload = {
    error,
  }

  const resp: WebSocketResponse = {
    type: WebSocketResponseTypes.ERROR,
    targetSigPubKey: target,
    senderSigPubKey: "",
    payload
  };

  socket.send(JSON.stringify(resp))
  return;
}

wsServer.on('connection', (socket: WebSocket) => {

  socket.on('open', () => {
    console.log("Open ws client connection");
  });

  socket.on('message', async (message: string) => {
    console.log("Received websocket message");
    let sender: string = "";
    let target: string = "";
    try {
      const req: WebSocketRequest = WebSocketRequestSchema.parse(JSON.parse(message));

      if (!req.senderSigPubKey) {
        throw new Error("Missing sender");
      }
      sender = req.senderSigPubKey;
      target = req.targetSigPubKey;

      if (!req.authToken) {
        return handleError(socket, sender, "Missing auth token.");
      }

      // Fetch user by auth token, ensure the request is from an authenticated user
      const user = await controller.GetUserByAuthToken(req.authToken);
      if (!user) {
        return handleError(socket, sender, "Invalid auth token.");
      }

      switch (req.type) {
        case WebSocketRequestTypes.CONNECT:
          if (!sender) {
            return handleError(socket, sender, "Missing sender.");
          }

          // Set record for future lookup
          clientsSockets[sender] = socket;

          // Return CONNECT_SUCCESS response
          const connectResponse: WebSocketResponse = MapRequestToResponse(req);

          if (clientsSockets[sender]) {
            clientsSockets[sender].send(JSON.stringify(connectResponse));
          } else {
            throw new Error("Sender client socket missing.");
          }

          return;
        case WebSocketRequestTypes.MSG:
          if (!target) {
            return handleError(socket, sender, "Missing target.");
          }

          // Return MSG response
          const msgResponse: WebSocketResponse = MapRequestToResponse(req);

          if (clientsSockets[target]) {
            clientsSockets[target].send(JSON.stringify(msgResponse));
          }
          return;
        case WebSocketRequestTypes.CLOSE:
          if (!sender) {
            return handleError(socket, sender, "Missing target.")
          }
          delete clientsSockets[sender];
          socket.close();
          return;
        default:
          return;
      };
    } catch (error) {
      const errMsg: string = `Error handling message: ${errorToString(error)}`;
      console.error(errMsg);
      return handleError(socket, sender, errMsg);
    }
  });

  socket.on('close', () => {
    console.log(`Close ws client connection`);
  });

});