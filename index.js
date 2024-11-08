const WebSocket = require("ws");
const PORT = 8080;

const server = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server started on ws://localhost:${PORT}`);

server.on("connection", (socket) => {
	console.log("New client connected");

	// Send a welcome message to the client
	socket.send(JSON.stringify({ message: "Welcome to the WebSocket server!" }));

	// Listen for messages from the client
	socket.on("message", (data) => {
		console.log("Received message:", data);

		// Broadcast the received message to all connected clients
		server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(data);
			}
		});
	});

	// Handle the client disconnecting
	socket.on("close", () => {
		console.log("Client disconnected");
	});

	// Handle any errors
	socket.on("error", (error) => {
		console.error("WebSocket error:", error);
	});
});
