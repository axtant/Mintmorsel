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
  items: OrderItem[];
  amount: number;
  paymentMethod: string;
  user: User;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  timestamp: string;
}

const orders: Map<string, Order> = new Map();
const activeConnections: Set<WebSocket> = new Set();

const server = http.createServer((request, response) => {
  response.end("hi there");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  activeConnections.add(ws);
  console.log("New client connected");
  ws.send(JSON.stringify({ type: 'status', message: 'Connected to server' }));

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received message:', data);

      switch (data.type) {
        case "order":
          await handleOrderPlacement(ws, data);
          break;
        case "status_update":
          await handleStatusUpdate(data);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Invalid request' 
      }));
    }
  });

  ws.on("close", () => {
    activeConnections.delete(ws);
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error('WebSocket error:', error);
    activeConnections.delete(ws);
  });
});

const handleOrderPlacement = async (ws: WebSocket, data: any) => {
  try {
    const { paymentMethod, items, user, timestamp } = data.data;
    
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Invalid items structure");
    }

    const orderId = `ORDER-${Date.now()}`;
    const totalAmount = items.reduce(
      (acc: number, item: OrderItem) => acc + item.price * item.quantity, 
      0
    );

    const order: Order = {
      orderId,
      items,
      amount: totalAmount,
      paymentMethod,
      user,
      status: "pending",
      timestamp,
    };

    orders.set(orderId, order);
    console.log(`Order Received: ${orderId}`);

    broadcast({
      type: "new_order",
      order
    });

    ws.send(JSON.stringify({ 
      type: 'order_ack', 
      orderId 
    }));
  } catch (error) {
    console.error('Error handling order placement:', error);
    ws.send(JSON.stringify({ 
      type: 'error', 
      message: 'Failed to process order' 
    }));
  }
};

const handleStatusUpdate = async (data: any) => {
  const order = orders.get(data.orderId);
  if (!order) {
    console.error(`Order ${data.orderId} not found`);
    return;
  }

  order.status = data.status;
  orders.set(data.orderId, order);

  broadcast({
    type: "status_update",
    orderId: data.orderId,
    status: data.status
  });
};

function broadcast(message: object) {
  const msg = JSON.stringify(message);
  activeConnections.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  });
}

server.listen(8081, () => {
  console.log((new Date()) + ' Server is listening on port 8081');
});
