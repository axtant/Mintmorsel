import { DurableObject, DurableObjectState, WebSocketPair } from '@cloudflare/workers-types';

export interface OrderItem {
  itemName: string;
  quantity: number;
  price: number;
}

export interface User {
  name: string;
  phone: number;
  address: string;
}

export interface Order {
  orderId: string;
  items: OrderItem[];
  amount: number;
  paymentMethod: string;
  user: User;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  timestamp: string;
}

export class OrderManagerDO implements DurableObject {
  private orders = new Map<string, Order>();
  private sockets = new Set<WebSocket>();

  constructor(private state: DurableObjectState, private env: any) {}

  async fetch(request: Request) {
    // Handle WebSocket upgrade
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected websocket", { status: 400 });
    }

    const pair = new WebSocketPair();
    const [client, server] = [pair[0], pair[1]];

    this.handleWebSocket(server);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  private async handleWebSocket(ws: WebSocket) {
    ws.accept();
    this.sockets.add(ws);

    ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "order":
            this.handleOrder(ws, data.data);
            break;
          case "order_status_update":
            this.handleStatusUpdate(data);
            break;
          default:
            ws.send(
              JSON.stringify({ type: "error", message: "Unknown message type" })
            );
        }
      } catch (e) {
        ws.send(
          JSON.stringify({ type: "error", message: "Invalid JSON message" })
        );
      }
    });

    ws.addEventListener("close", () => {
      this.sockets.delete(ws);
    });

    ws.addEventListener("error", (err) => {
      console.error("WebSocket error:", err);
      this.sockets.delete(ws);
    });
  }

  private broadcast(message: any) {
    const msg = JSON.stringify(message);
    for (const socket of this.sockets) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(msg);
      }
    }
  }

  private handleOrder(ws: WebSocket, data: any) {
    try {
      const { paymentMethod, items, user, timestamp } = data;

      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Invalid items");
      }

      const orderId = `ORDER-${Date.now()}`;
      const processedItems = items.map((item: any) => ({
        itemName: item.itemName,
        quantity: item.quantity,
        price: item.price,
      }));

      const totalAmount = processedItems.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
      );

      const order: Order = {
        orderId,
        items: processedItems,
        amount: totalAmount,
        paymentMethod,
        user,
        status: "pending",
        timestamp,
      };

      this.orders.set(orderId, order);

      // Persist state (optional)
      this.state.storage.put(orderId, order);

      console.log(`Order Received: ${orderId}`);

      // Broadcast to all clients
      this.broadcast({
        type: "order_received",
        orderId,
        items: processedItems,
        amount: totalAmount,
        user,
        status: "pending",
      });

      // Acknowledge sender
      ws.send(JSON.stringify({ type: "order_ack", orderId }));
    } catch (error) {
      console.error("Error handling order:", error);
      ws.send(JSON.stringify({ type: "error", message: error }));
    }
  }

  private handleStatusUpdate(data: any) {
    const { orderId, status } = data;
    if (!this.orders.has(orderId)) {
      console.error(`Order ${orderId} does not exist`);
      return;
    }
    const order = this.orders.get(orderId)!;
    order.status = status;
    this.orders.set(orderId, order);
    this.state.storage.put(orderId, order);

    // Broadcast status update
    this.broadcast({
      type: "order_status_update",
      orderId,
      status,
    });
  }
}
