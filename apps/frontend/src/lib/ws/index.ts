import {BASE_API_WS} from "@/config";
import {
  WebSocketRequest,
  WebSocketRequestTypes,
  WebSocketResponseSchema,
  WebSocketResponseTypes,
  errorToString,
  WebSocketResponse,
  WebSocketErrorPayloadSchema,
  WebSocketErrorPayload,
  CreateMessageDataSchema,
  CreateMessageData,
  MessageData,
  MapCreateMessageDataToMessageData
} from "@types";
import { getUserAndSession } from "@/lib/storage/localStorage/user";
import { getUserSigPubKey } from "@/lib/user";
import { storage } from "@/lib/storage";


export const wsClient: WebSocket = new WebSocket(`${BASE_API_WS}`);

wsClient.onopen = async () => {
  console.log("Open ws server connection")

  const user = await storage.getUser();
  const session = await storage.getSession();

  if (user) {
    const sigPubKey: string = getUserSigPubKey(user);
    if (sigPubKey && session) {
      // WS connection is established earlier but need user public key for any requests
      wsConnectUser(session.authTokenValue, sigPubKey);
    }
  } else {
    console.warn("No user public signing key available, unable to establish websocket connection")
  }
};

// @ts-expect-error : solve "TS2702: WebSocket only refers to a type, but is being used as a namespace here."
wsClient.onmessage = async (ev: WebSocket.MessageEvent) => {
  if (!ev || !ev.data) {
    console.warn("Message is invalid")
    return;
  }

  try {
    const resp: WebSocketResponse = WebSocketResponseSchema.parse(JSON.parse(ev.data));

    switch (resp.type) {
      case WebSocketResponseTypes.MSG:
        const createMessage: CreateMessageData = CreateMessageDataSchema.parse(resp.payload);

        // Convert create to message by adding created at
        const message: MessageData = MapCreateMessageDataToMessageData(createMessage)

        if (message) {
          // processNewMessages handles updating user state and creating backups
          await storage.processNewMessages([message]);
        }

        return;
      case WebSocketResponseTypes.ERROR:
        const payload: WebSocketErrorPayload = WebSocketErrorPayloadSchema.parse(JSON.parse(resp.payload));
        throw Error(`WS message returned an error: ${payload.error}`);
        return;
      default:
    }
  } catch (error) {
    console.error("Error handling ws message:", errorToString(error));
    return;
  };
};

wsClient.onclose = async () => {
  const { user, session } = await getUserAndSession();
  const senderSigPubKey: string = getUserSigPubKey(user);

  // Close server's client socket
  wsRequest(session.authTokenValue, WebSocketRequestTypes.CLOSE, "",  senderSigPubKey, "");
};

export const wsConnectUser = (authToken: string, senderSigPubKey: string): void => {
  wsRequest(authToken, WebSocketRequestTypes.CONNECT, "", senderSigPubKey, "");
  return;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const wsRequest = (authToken: string, type: string, targetSigPubKey: string, senderSigPubKey: string, payload: any): void => {

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