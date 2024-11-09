import { Server, Socket } from "socket.io";
import { server } from "@/index";
import {
  SocketRequestType,
  SocketRequestSchema,
  SocketRequest,
  SocketResponseType,
  SocketResponse,
  SocketErrorPayload,
  MapRequestToResponse,
  errorToString
} from "@types";
import { Controller } from "@/lib/controller";

export const wsServer = new Server(server);

const controller = new Controller();

const clientsSockets: Record<string, Socket> = {};

const handleError = (socket: Socket, recipient: string, error: string): void => {
  const payload: SocketErrorPayload = {
    error,
  }

  const resp: SocketResponse = {
    type: SocketResponseType.ERROR,
    recipientSigPubKey: recipient,
    senderSigPubKey: "",
    payload
  };

  socket.send(JSON.stringify(resp))
  return;
}

wsServer.on('connection', (socket: Socket) => {
  socket.on('open', () => {
    console.log("Open socket client connection.");
  });

  socket.on('disconnect', () => {
    console.log(`Disconnect socket client connection.`);
  });

  socket.on('message', async (message: string) => {
    let sender: string | null = null;
    let recipient: string | null = null;
    try {
      const req: SocketRequest = SocketRequestSchema.parse(JSON.parse(message));

      if (!req.senderSigPubKey) {
        throw new Error("Missing sender");
      }

      sender = req.senderSigPubKey;
      recipient = req.recipientSigPubKey;

      if (!req.authToken) {
        return handleError(socket, sender, "Missing auth token.");
      }

      // Fetch user by auth token, ensure the request is from an authenticated user
      const user = await controller.GetUserByAuthToken(req.authToken);
      if (!user) {
        return handleError(socket, sender, "Invalid auth token.");
      } else if (user.signaturePublicKey !== sender) {
        return handleError(socket, sender, "Incorrect user key");
      }

      switch (req.type) {
        case SocketRequestType.CONNECT:
          if (!sender) {
            return handleError(socket, sender, "Missing sender.");
          }

          // Set record for future lookup
          clientsSockets[sender] = socket;

          // Return CONNECT_SUCCESS response
          const connectResponse: SocketResponse = MapRequestToResponse(req);

          if (clientsSockets[sender]) {
            clientsSockets[sender].send(JSON.stringify(connectResponse));
          } else {
            throw new Error("Sender client socket missing.");
          }
          return;
        case SocketRequestType.TAP_BACK:
          if (!recipient) {
            return handleError(socket, sender, "Missing recipient.");
          }

          const msgResponse: SocketResponse = MapRequestToResponse(req);

          if (clientsSockets[recipient]) {
            console.log("recipient socket exists")
            clientsSockets[recipient].send(JSON.stringify(msgResponse));
          }
          return;
        case SocketRequestType.CLOSE:
          if (!sender) {
            return handleError(socket, sender, "Missing target.")
          }
          delete clientsSockets[sender];
          socket.disconnect();
          return;
        default:
          return;
      };
    } catch (error) {
      const errMsg: string = `Error handling message: ${errorToString(error)}`;
      console.error(errMsg);
      if (sender) {
        return handleError(socket, sender, errMsg);
      }
      return;
    }
  });
});