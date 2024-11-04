"use client"
import { BASE_API_WS } from "@/config";
import { IMessageEvent } from "websocket";

export const wsClient: WebSocket = new WebSocket(`${BASE_API_WS}`);

wsClient.onopen = async () => {
  console.log("Open ws connection")
};

wsClient.onmessage = async (ev: IMessageEvent) => {
  if (!ev || !ev.data) {
    console.warn("Message is invalid")
    return;
  }

  return;
};

wsClient.onclose = async () => {
  console.log("Close ws connection")
  return;
};