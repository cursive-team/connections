import { BASE_API_WS } from "@/config";
import { IMessageEvent } from "websocket";
import { storage } from "@/lib/storage";
import { getUserSigPubKey } from "@/lib/user";
import {
  WebSocketRequestTypes,
  WebSocketRequest,
  WebSocketResponseTypes,
  WebSocketResponse,
  WebSocketResponseSchema,
  WebSocketErrorPayload,
  WebSocketErrorPayloadSchema,
  errorToString
} from "@types";

// Global variables for connection status
let expectConnectResp: boolean = false;
let successfulConnection: boolean = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const wsRequest = (authToken: string, type: string, targetSigPubKey: string, senderSigPubKey: string, payload: any): void => {

  if (expectConnectResp && type !== WebSocketRequestTypes.CONNECT) {
    console.warn("While waiting for successful connection response no other websocket requests are allowed, abort");
    return;
  } else if (!successfulConnection && type !== WebSocketRequestTypes.CONNECT) {
    console.error("Websocket connection was not successfully established, abort");
    return;
  }

  const req: WebSocketRequest = {
    authToken,
    type,
    targetSigPubKey,
    senderSigPubKey,
    payload,
  }

  wsClient.send(JSON.stringify(req));
  return;
}

export const wsConnectRequest = (authToken: string, senderSigPubKey: string): void => {
  wsRequest(authToken, WebSocketRequestTypes.CONNECT, "", senderSigPubKey, "");
  return;
}

export const WebsocketConnectUser = async (): Promise<void> => {
  try {
    // Onopen websocket client error: localStorage is not defined
    // hypothesis: server-side rendering of component
    // unfortunately this is at the root of the app, so that would mean all the components

    // TODO: how to remove storage dependency for ws?
    const user = await storage.getUser();
    const session = await storage.getSession();

    if (user) {
      const sender: string = getUserSigPubKey(user);
      if (sender && session) {
        expectConnectResp = true;

        // First step after creating connection is sending server sender public signing key for client socket lookup
        wsConnectRequest(session.authTokenValue, sender);

        // Expect CONNECT_SUCCESS response
        expectConnectResp = true;
      }
    } else {
      throw new Error("No user public signing key available, unable to establish websocket connection");
    }
  } catch (error) {
    console.error(`Onopen websocket client error: ${errorToString(error)}`);
    return;
  }
}

export const wsClient: WebSocket = new WebSocket(`${BASE_API_WS}`);

wsClient.onopen = async () => {
  console.log("Open websocket connection")
  try {

    // Onopen websocket client error: localStorage is not defined
    // hypothesis: server-side rendering of component
    // unfortunately this is at the root of the app, so that would mean all the components

    // TODO: how to remove storage dependency for ws?
    const user = await storage.getUser();
    const session = await storage.getSession();

    if (user) {
      const sender: string = getUserSigPubKey(user);
      if (sender && session) {
        expectConnectResp = true;

        // First step after creating connection is sending server sender public signing key for client socket lookup
        wsConnectRequest(session.authTokenValue, sender);

        // Expect CONNECT_SUCCESS response
        expectConnectResp = true;
      }
    } else {
      throw new Error("No user public signing key available, unable to establish websocket connection");
    }
  } catch (error) {
    console.error(`Onopen websocket client error: ${errorToString(error)}`);
    return;
  }
};

wsClient.onmessage = async (ev: IMessageEvent) => {
  if (!ev || !ev.data) {
    console.warn("Websocket message is invalid");
    return;
  }

  try {
    const resp: WebSocketResponse = WebSocketResponseSchema.parse(JSON.parse(ev.data.toString()));

    switch (resp.type) {
      case WebSocketResponseTypes.SUCCESS_CONNECT:
        // Allow client websocket messages now
        expectConnectResp = false;
        successfulConnection = true;
        return;
      case WebSocketResponseTypes.ERROR:
        const payload: WebSocketErrorPayload = WebSocketErrorPayloadSchema.parse(JSON.parse(resp.payload));
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
};

wsClient.onclose = async () => {
  console.log("Close websocket connection")
  return;
};