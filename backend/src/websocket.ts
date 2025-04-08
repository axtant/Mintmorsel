import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

interface OrderItem {
  itemName: string;
  quantity: number;
  price: number;
}

interface User {
    name: string;
    phone: number;
    address: string;
  }
  
  interface Order {
    orderId: string;
    items: { itemName: string; quantity: number; price: number }[];
    amount: number;
    paymentMethod: string;
    user: User; // Add user details here
    status: "pending" | "accepted" | "rejected" | "cancelled";
    timestamp: string;
  }

const orders: Map<string, Order> = new Map();

const server = http.createServer((request, response) => {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.end("hi there");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");
  ws.send(JSON.stringify({ type: 'status', message: 'Connected to server' }));

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received message:', data);

      switch (data.type) {
        case "order":
          handleOrderPlacement(ws, data);
          break;
        case "order_status_update":
          handleStatusUpdate(data);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
  ws.on("error", (error) => console.error('WebSocket error:', error));
});
const handleOrderPlacement = (ws: WebSocket, data: any) => {
    try {
      const { paymentMethod, items, total, user, timestamp } = data.data;
  
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Invalid items structure");
      }
  
      const orderId = `ORDER-${Date.now()}`;
      const processedItems = items.map((item: any) => ({
        itemName: item.itemName,
        quantity: item.quantity,
        price: item.price,
      }));
  
      const totalAmount = processedItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  
      orders.set(orderId, {
        orderId,
        items: processedItems,
        amount: totalAmount,
        paymentMethod,
        user, // Ensure user details are included
        status: "pending",
        timestamp,
      });
  
      console.log(`Order Received: ${orderId}`);
  
      // Broadcast to all clients (e.g., admin dashboard)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "order_received",
            orderId,
            items: processedItems,
            amount: totalAmount,
            user, // Include user details here
            status: "pending",
          }));
        }
      });
  
      // Send acknowledgement back to client
      ws.send(JSON.stringify({ type: 'order_ack', orderId }));
    } catch (error) {
      console.error('Error handling order placement:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Failed to process order' }));
    }
  };

const handleStatusUpdate = (data: any) => {
  const orderId = data.orderId;
  const status = data.status;

  if (orders.has(orderId)) {
    const order = orders.get(orderId);
    if (order) { // Ensure 'order' is not undefined
      order.status = status;
      orders.set(orderId, order); // Update the map with the modified order
    } else {
      console.error(`Order with ID ${orderId} exists in the map but returned undefined.`);
    }
  } else {
    console.error(`Order with ID ${orderId} does not exist.`);
  }
};

server.listen(8081, function() {
  console.log((new Date()) + ' Server is listening on port 8081');
});
