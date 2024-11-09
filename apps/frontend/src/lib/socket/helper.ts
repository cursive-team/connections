import { Socket } from 'socket.io-client';
import {
  SocketRequestType,
  SocketRequest,
  errorToString,
} from "@types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const socketEmit = ({
  socketInstance,
  connected,
  type,
  recipientSigPubKey,
}: {
  socketInstance: Socket;
  connected: boolean,
  type: SocketRequestType,
  recipientSigPubKey: string | null,
}): void => {

  // TODO: consider what to do if / when requests occur while connect_success hasn't occurred yet

  const req: SocketRequest = {
    type,
    recipientSigPubKey,
  }

  socketInstance.emit("message", JSON.stringify(req));
  return;
}

export const SocketExpungeConnection = async ({
  socketInstance,
  connected,
}: {
  socketInstance: Socket;
  connected: boolean,
}): Promise<void> => {
  try {
    // Close server's client socket
    socketEmit({
      socketInstance,
      connected,
      type: SocketRequestType.CLOSE,
      recipientSigPubKey: null,
    });
  } catch (error) {
    console.error("Onclose socket client error:", errorToString(error));
    return;
  }
}