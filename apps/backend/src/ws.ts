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

import { wsServer } from "@/index";

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
  }

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
    try {
      const req: WebSocketRequest = WebSocketRequestSchema.parse(JSON.parse(message));

      if (!req.senderSigPubKey) {
        throw new Error("Missing sender");
      }
      sender = req.senderSigPubKey

      if (!req.authToken) {
        return handleError(socket, sender, "Missing auth token.")
      }

      switch (req.type) {
        case WebSocketRequestTypes.CONNECT:
          // Set record for future lookup
          clientsSockets[sender] = socket;

          // Return CONNECT_SUCCESS response
          const resp: WebSocketResponse = MapRequestToResponse(req);
          const stringResp: string = JSON.stringify(resp);

          if (clientsSockets[sender]) {
            clientsSockets[sender].send(stringResp);
          } else {
            throw new Error("Sender socket missing");
          }

          return;
        default:
      };
    } catch (error) {
      const errMsg: string = `Error handling message: ${errorToString(error)}`
      console.error(errMsg);
      return handleError(socket, sender, errMsg);
    }
  });

  socket.on('close', () => {
    console.log(`Close ws client connection`);
  });

});