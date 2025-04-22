// src/order-manager.ts
import type { DurableObject } from '@cloudflare/workers-types';

interface Order {
  orderId: string;
  items: Array<{ itemName: string; quantity: number; price: number }>;
  status: "pending" | "accepted" | "rejected" | "cancelled";
}

export class OrderManager implements DurableObject {
  private storage: DurableObjectStorage;
  private connections: WebSocket[] = [];

  constructor(private state: DurableObjectState) {
    this.storage = this.state.storage;
    
    // Restore active WebSockets on wake from hibernation
    this.state.getWebSockets().forEach(ws => {  
      this.connections.push(ws);
    });
  }

  async fetch(request: Request) {
    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      
      // Accept WebSocket using hibernation API
      this.state.acceptWebSocket(server);
      this.connections.push(server);

      return new Response(null, { 
        status: 101, 
        webSocket: client 
      });
    }

    return new Response("WebSocket endpoint expected", { status: 400 });
  }

  async webSocketMessage(ws: WebSocket, message: string) {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'order':
          await this.handleOrder(ws, data);
          break;
        case 'status_update':
          await this.handleStatusUpdate(data);
          break;
      }
    } catch (error) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Invalid request' 
      }));
    }
  }

  async webSocketClose(ws: WebSocket) {
    this.connections = this.connections.filter(conn => conn !== ws);
  }

  async webSocketError(ws: WebSocket, error: unknown) {
    console.error('WebSocket error:', error);
    this.connections = this.connections.filter(conn => conn !== ws);
  }

  private async handleOrder(ws: WebSocket, data: any) {
    const orderId = `ORDER-${Date.now()}`;
    const order = {
      orderId,
      items: data.data.items,
      status: 'pending',
      paymentMethod: data.data.paymentMethod,
      total: data.data.total,
      timestamp: data.data.timestamp,
      user: data.data.user
    };

    // Persist order
    await this.storage.put(orderId, order);

    // Broadcast the new order to all connected clients (dashboard)
    this.broadcast({
      type: 'new_order',
      order
    });
    
    ws.send(JSON.stringify({ 
      type: 'order_ack', 
      orderId 
    }));
  }

  private async handleStatusUpdate(data: any) {
    const order = await this.storage.get<Order>(data.orderId);
    if (!order) return;

    order.status = data.status;
    await this.storage.put(data.orderId, order);

    this.broadcast({
      type: 'status_update',
      orderId: data.orderId,
      status: data.status
    });
  }

  private broadcast(message: object) {
    const msg = JSON.stringify(message);
    this.connections.forEach(ws => {
      if (ws.readyState === WebSocket.READY_STATE_OPEN) {
        ws.send(msg);
      }
    });
  }
}
