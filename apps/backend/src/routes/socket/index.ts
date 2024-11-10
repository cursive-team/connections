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
  errorToString,
} from "@types";
import {
  User,
} from "@/lib/controller/postgres/types";
import { Controller } from "@/lib/controller";

// Extend the interface to include User info -- with the User info attached we do not need sender info in request
declare module 'socket.io' {
  interface Socket {
    user: User;
  }
}

export const wsServer = new Server(server);

const controller = new Controller();

const clientsSockets: Record<string, Socket> = {};

// Middleware to authenticate the socket connection
wsServer.use(async(socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  // Fetch user by auth token
  const user = await controller.GetUserByAuthToken(token);

  if (!user) {
    return next(new Error("Authentication error"));
  } else {
    // Attach user info to socket object
    socket.user = user;

    // Set client lookup record
    clientsSockets[user.signaturePublicKey] = socket;

    return next();
  }

  return next(new Error("Authentication error"));
});


const handleError = (socket: Socket, error: string): void => {
  const payload: SocketErrorPayload = {
    error,
  }

  const resp: SocketResponse = {
    type: SocketResponseType.ERROR,
    recipientSigPubKey: socket.user.signaturePublicKey,
    payload
  };

  socket.send(JSON.stringify(resp))
  return;
}

wsServer.on('connection', (socket: Socket) => {
  socket.on('open', () => {
    console.log("Open authenticated socket client connection.");
  });

  socket.on('disconnect', () => {
    console.log(`Disconnect socket client connection.`);
  });

  socket.on('message', async (message: string) => {
    let sender = socket.user.signaturePublicKey;
    let recipient: string | null = null;
    try {
      const req: SocketRequest = SocketRequestSchema.parse(JSON.parse(message));

      recipient = req.recipientSigPubKey;
      switch (req.type) {
        case SocketRequestType.TAP_BACK:
          if (!recipient) {
            return handleError(socket, "Missing recipient.");
          }

          const tapBackResponse: SocketResponse = MapRequestToResponse(req);

          if (clientsSockets[recipient]) {
            clientsSockets[recipient].send(JSON.stringify(tapBackResponse));
          }
          return;
        case SocketRequestType.PSI:
          if (!recipient) {
            return handleError(socket, "Missing recipient.");
          }

          const psiResponse: SocketResponse = MapRequestToResponse(req);

          if (clientsSockets[recipient]) {
            clientsSockets[recipient].send(JSON.stringify(psiResponse));
          }
          return;
        case SocketRequestType.EXPUNGE:
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
        return handleError(socket, errMsg);
      }
      return;
    }
  });
});