import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BASE_API_WS } from "@/config";
import {
  SocketExpungeConnection,
} from "@/lib/socket/helper";
import {
  SocketResponseSchema,
  SocketResponse,
  SocketResponseType,
  SocketErrorPayloadSchema,
  SocketErrorPayload,
  errorToString, SocketRequestType
} from "@types";
import {
  refreshMessages
} from "@/lib/message";

import { storage } from "@/lib/storage";

export * from "./helper";

interface SocketContextProps {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext({} as SocketContextProps);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const session = storage.syncGetSession();
    if (!session) {
      // Do not establish connection until session is available
      return;
    }

    const socketInstance = io(BASE_API_WS, {
      transports: ['websocket'],
      auth: {
        token: session?.authTokenValue,
      }
    });

    socketInstance.on('error', (err) => {
      console.error(`Socket connection error: ${errorToString(err)}`);
    });

    socketInstance.on('connect', () => {
      // NOTE: if the socket successfully connects it means it is authenticated. This means the client lookup was
      // set up in the backend service.
      // Before making an authenticated connection an additional step was needed to send the public key, which would
      // be used to create an entry from key to the client's socket.
      // Now, by providing the access token when the connection is first established, the token can be used for user
      // lookup, and the user.publicSigningKey can be used for creating the lookup entry. Hot damn, that's fine.
      setConnected(true);
      console.warn("Authenticated socket server connection is established.");
    });

    socketInstance.on('message', async (ev) => {
      if (!ev) {
        console.warn("Socket message is invalid");
        return;
      }
      try {
        const resp: SocketResponse = SocketResponseSchema.parse(JSON.parse(ev));

        switch (resp.type) {
          case SocketResponseType.TAP_BACK:
            refreshMessages();
            return;
          case SocketResponseType.PSI:
            console.log("received PSI refresh message")
            return;
          case SocketResponseType.ERROR:
            const payload: SocketErrorPayload = SocketErrorPayloadSchema.parse(JSON.parse(resp.payload));
            throw Error(`Socket message returned an error: ${payload.error}`);
            return;
          default:
            return;
        }
      } catch (error) {
        console.error("Onmessage socket client error:", errorToString(error));
        return;
      }
      return;
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnect socket server connection.');
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      // Expunge client from server
      SocketExpungeConnection({
        socketInstance,
      });

      socketInstance.disconnect();
      console.log('Socket disconnected.');
    };
  }, []);



  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};