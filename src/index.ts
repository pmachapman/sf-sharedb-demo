import { Canon } from "@sillsdev/scripture";
import * as RichText from "rich-text";
import { Connection, types } from "sharedb/lib/client";
import { Socket } from "sharedb/lib/sharedb";
import WebSocket from "ws";
import { ShareDBWebsocketAdapter } from "./sharedbwebsocketadaptor";

// Allow rich-text documents
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

  // Get the project and subscribe to changes
  const projectId = ""; // TODO: Change to your project identifier
  var projectDoc = connection.get("sf_projects", projectId);
  projectDoc.subscribe(() => {
    // Get the first chapter of the first book in the project
    const textId = `${projectId}:${Canon.bookNumberToId(
      projectDoc.data.texts[0].bookNum
    )}:${projectDoc.data.texts[0].chapters[0].number}:target`;
    var doc = connection.get("texts", textId);
    doc.subscribe(() => {
      // Display the text document's ops
      console.log(JSON.stringify(doc.data));
    });
    doc.fetch();
  });
  projectDoc.fetch();
};
