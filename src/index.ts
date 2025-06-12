import * as RichText from "rich-text";
import { Connection, types } from "sharedb/lib/client";
import WebSocket from "ws";
import { ShareDBWebsocketAdapter } from "./sharedbwebsocketadaptor";
import { Socket, Type } from "sharedb/lib/sharedb";

// Allow rich-text
types.register(RichText.type);

// Create class to allow custom a custom origin
class CustomOriginWebSocket extends WebSocket {
  constructor(
    address: string,
    protocols?: string | string[],
    options: WebSocket.ClientOptions = {}
  ) {
    // Add or override the Origin header
    options.headers = {
      ...(options.headers || {}),
      // NOTE: Use https://qa.scriptureforge.org on QA, or https://scriptureforge.org on live for origin
      origin: "http://localhost:5000",
    };
    super(address, protocols, options);
  }
}

// Open WebSocket connection to ShareDB server
const access_token = ""; // TODO: Get this value from Auth0
var socket = new ShareDBWebsocketAdapter(
  // NOTE: Use wss on qa or live
  `ws://localhost:5003/?access_token=${access_token}`,
  [],
  {
    // ShareDB handles dropped messages, and buffering them while the socket
    // is closed has undefined behavior
    maxEnqueuedMessages: 0,
    WebSocket: CustomOriginWebSocket,
  }
) as Socket;

// Log any errors for debugging
socket.onerror = (event) => {
  console.log(event);
};

// When the socket opens, begin the connection
socket.onopen = () => {
  var connection = new Connection(socket);

  // Get a document by id
  var doc = connection.get("texts", "675a27a0a8304fe61e341436:GEN:2:target");

  // Get initial value of document and subscribe to changes
  doc.subscribe(() => {
    console.log(doc.data);
  });
  doc.fetch();
};
