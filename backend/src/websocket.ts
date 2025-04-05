import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

const server = http.createServer(function(request: any, response: any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.end("hi there");
});

interface Order {
    orderId: string;
    items: any[];
    amount: number;
    status: "pending" | "accepted" | "rejected" | "cancelled";
}

const orders = new Map<string, Order>();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
    console.log("New client connected");
    ws.send(JSON.stringify({ type: 'status', message: 'Connected to server' }));

    ws.on("message", (message) => {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);

        switch (data.type) {
            case "order":
                handleOrderPlacement(ws, data);
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    });

    ws.on("close", () => console.log("Client disconnected"));
    ws.on("error", (error) => console.error('WebSocket error:', error));
});

const handleOrderPlacement = (ws: WebSocket, data: any) => {
    const order = data.data[0]; // Assuming data.data is an array with one order item
    const orderId = Date.now().toString(); // Generate a unique order ID
    orders.set(orderId, { orderId, items: [order.itemName], amount: order.price * order.quantity, status: "pending" });

    console.log(`Order Received: ${orderId}`);

    // Broadcast to all clients (e.g., admin dashboard)
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "order_received", orderId, items: [order.itemName], amount: order.price * order.quantity }));
        }
    });
};

server.listen(8081, function() {
    console.log((new Date()) + ' Server is listening on port 8081');
});
