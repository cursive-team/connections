import { Socket } from 'socket.io-client';
import {
  SocketRequestType,
  SocketRequest,
  errorToString,
} from "@types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const socketEmit = ({
  socketInstance,
  type,
  recipientSigPubKey,
}: {
  socketInstance: Socket;
  type: SocketRequestType,
  recipientSigPubKey: string | null,
}): void => {

  const req: SocketRequest = {
    type,
    recipientSigPubKey,
  }

  socketInstance.emit("message", JSON.stringify(req));
  return;
}

export const SocketExpungeConnection = async ({
  socketInstance,
}: {
  socketInstance: Socket;
}): Promise<void> => {
  try {
    // Expunge server's client socket lookup entry
    socketEmit({
      socketInstance,
      type: SocketRequestType.EXPUNGE,
      recipientSigPubKey: null,
    });
  } catch (error) {
    console.error("Onclose socket client error:", errorToString(error));
    return;
  }
}