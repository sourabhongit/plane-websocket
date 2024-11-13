const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 4070 });

console.log("WebSocket server started on 4070");

let countdown = 30;

const startCountdown = () => {
	setInterval(() => {
		if (countdown >= 0) {
			// Broadcast the countdown to all connected clients
			wss.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify({ countdown: countdown }));
				}
			});
			countdown--;
		} else {
			// Reset countdown to 30 when it reaches -1
			countdown = 30;
		}
	}, 1000);
};

// Start the countdown when the server starts
startCountdown();

wss.on("connection", (socket) => {
	console.log("New client connected!");

	// Send a welcome message and current countdown to the newly connected client
	socket.send(JSON.stringify({ message: "oooho yess bhai!!!!!!", countdown: countdown }));

	// Listen for messages from the client
	socket.on("message", (data) => {
		console.log("Received message:", data);

		try {
			const parsedData = JSON.parse(data);

			// Broadcast the received message to all connected clients
			wss.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(parsedData));
				}
			});
		} catch (err) {
			console.error("Error parsing message:", err.message);
		}
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
