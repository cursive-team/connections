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
  errorToString
} from "@types";
import {
  refreshMessages
} from "@/lib/message";

import { SocketFinalizeConnection } from "@/lib/socket/helper";
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
    // Setup steps:
    // 1. authenticated connection, refuse to establish connection until session available
    // 2. establish connection
    // 3. send user public key info, for socket lookup in backend service
    // 4. messaging
    // 5. close -- expunge public key info
    // 6. close connection

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
      if (!connected) {
        // Send user public key information to server for socket lookups
        SocketFinalizeConnection({
          socketInstance,
          connected,
          setConnected
        });
      }
    });

    socketInstance.on('message', async (ev) => {
      if (!ev) {
        console.warn("Websocket message is invalid");
        return;
      }
      try {
        const resp: SocketResponse = SocketResponseSchema.parse(JSON.parse(ev));

        switch (resp.type) {
          case SocketResponseType.SUCCESS_CONNECT:
            // Enable other message types now
            setConnected(true);
            return;
          case SocketResponseType.TAP_BACK:
            refreshMessages();
            return;
          case SocketResponseType.ERROR:
            const payload: SocketErrorPayload = SocketErrorPayloadSchema.parse(JSON.parse(resp.payload));
            throw Error(`Websocket message returned an error: ${payload.error}`);
            return;
          default:
            return;
        }
      } catch (error) {
        console.error("Onmessage websocket client error:", errorToString(error));
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
        connected
      });

      socketInstance.disconnect();
      console.log('Socket disconnected.');
    };
  }, [setConnected]);



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