import { WebSocketServer, WebSocket } from 'ws';
import { WebSocketRequestSchema } from '@types';
import { Controller } from "@/lib/controller";
import {
  errorToString,
  MapRequestToResponse,
  WebSocketErrorPayload,
  WebSocketRequest,
  WebSocketRequestTypes,
  WebSocketResponse,
  WebSocketResponseTypes
} from "@types";

const WS_PORT = process.env.WS_PORT || 8090;

const wsServer = new WebSocketServer({ port: Number(WS_PORT) })

const controller = new Controller();

const clients: Record<string, WebSocket> = {};

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
    console.log("Open ws client connection")
  });

  socket.on('message', async (message: string) => {
    const req: WebSocketRequest = WebSocketRequestSchema.parse(JSON.parse(message));

    if (!req.authToken) {
      return handleError(socket, req.senderSigPubKey, "Missing auth token.")
    }

    // Fetch user by auth token
    // While the user isn't specifically required, it ensures the request is from an authenticated user
    const user = await controller.GetUserByAuthToken(req.authToken);

    if (!user) {
      return handleError(socket, req.senderSigPubKey, "Invalid auth token.")
    }

    try {
      switch (req.type) {
        case WebSocketRequestTypes.CONNECT:
          if (!req.senderSigPubKey) {
            return handleError(socket, req.senderSigPubKey, "Missing target.")
          }

          // Set record for future lookup
          clients[req.senderSigPubKey] = socket;

          // NOTE: do I need to return response to signal successful connection?
          return;
        case WebSocketRequestTypes.CLOSE:
          if (!req.senderSigPubKey) {
            return handleError(socket, req.senderSigPubKey, "Missing target.")
          }
          delete clients[req.senderSigPubKey];
          socket.close();
          return;
        case WebSocketRequestTypes.MSG:
          if (!req.targetSigPubKey) {
            return handleError(socket, req.senderSigPubKey, "Invalid target")
          }

          const resp: WebSocketResponse = MapRequestToResponse(req);
          const stringResp: string = JSON.stringify(resp);

          if (clients[req.targetSigPubKey]) {
            clients[req.targetSigPubKey].send(stringResp);
          }
          return;
        default:
      };
    } catch (error) {
      return handleError(socket, req.senderSigPubKey, `Error handling message: ${errorToString(error)}`)
      return;
    };
  });

  socket.on('close', () => {
    console.log(`Close ws client connection`);
  });
});
