import { Socket } from 'socket.io-client';
import {
  SocketRequestType,
  SocketRequest,
  errorToString,
} from "@types";
import { storage } from "@/lib/storage";
import { getUserSigPubKey } from "@/lib/user";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const socketEmit = ({
  socketInstance,
  connected,
  authToken,
  type,
  senderSigPubKey,
  recipientSigPubKey,
}: {
  socketInstance: Socket;
  connected: boolean,
  authToken: string,
  type: SocketRequestType,
  senderSigPubKey: string | null,
  recipientSigPubKey: string | null,
}): void => {

  // TODO: consider what to do if / when requests occur while connect_success hasn't occurred yet

  const req: SocketRequest = {
    authToken,
    type,
    senderSigPubKey,
    recipientSigPubKey,
  }

  socketInstance.emit("message", JSON.stringify(req));
  return;
}

export const SocketConnectRequest = ({
  socketInstance,
  connected,
  authToken,
  senderSigPubKey,
}: {
  socketInstance: Socket;
  connected: boolean,
  authToken: string,
  senderSigPubKey: string | null,
}): void => {
  socketEmit({
    socketInstance,
    connected,
    authToken,
    type: SocketRequestType.CONNECT,
    senderSigPubKey: senderSigPubKey,
    recipientSigPubKey: null,
  });
}

// Call in a context where localstorage is available client-side.
// localstorage cannot be used with server-side rendering.
export const SocketFinalizeConnection = async ({
  socketInstance,
  connected,
  setConnected,
}: {
  socketInstance: Socket;
  connected: boolean,
  setConnected: React.Dispatch<React.SetStateAction<boolean>>,
}): Promise<void> => {
  if (connected) {
    return;
  }

  try {
    const user = await storage.getUser();
    const session = await storage.getSession();

    if (user) {
      const sender: string = getUserSigPubKey(user);
      if (sender && session) {
        // After establishing connection, send client public signing key for client socket lookup
        SocketConnectRequest({
          socketInstance,
          connected,
          authToken: session.authTokenValue,
          senderSigPubKey: sender
        });

        // Fully connected now
        setConnected(true);
      }
    } else {
      throw new Error("No user public signing key available, unable to establish websocket connection.");
    }
  } catch (error) {
    console.error(`Onopen websocket client error: ${errorToString(error)}`);
    return;
  }
}

export const SocketCloseConnection = async ({
  socketInstance,
  connected,
}: {
  socketInstance: Socket;
  connected: boolean,
}): Promise<void> => {
  try {
    const { user, session } = await storage.getUserAndSession();
    const senderSigPubKey: string = getUserSigPubKey(user);

    // Close server's client socket
    socketEmit({
      socketInstance,
      connected,
      authToken: session.authTokenValue,
      type: SocketRequestType.CLOSE,
      senderSigPubKey,
      recipientSigPubKey: null,
    });
  } catch (error) {
    console.error("Onclose socket client error:", errorToString(error));
    return;
  }
}