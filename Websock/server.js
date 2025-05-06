const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const orders = {}; // In-memory store for orders
const connections = new Set();

wss.on('connection', ws => {
  connections.add(ws);

  ws.on('message', message => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'order') {
        handleOrder(ws, data);
      } else if (data.type === 'status_update') {
        handleStatusUpdate(data);
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', message: err.message || 'Invalid request' }));
    }
  });

  ws.on('close', () => {
    connections.delete(ws);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    connections.delete(ws);
  });
});

function handleOrder(ws, data) {
  const orderId = `ORDER-${Date.now()}`;
  const order = {
    orderId,
    items: data.data.items,
    paymentMethod: data.data.paymentMethod,
    total: data.data.total,
    timestamp: data.data.timestamp,
    user: data.data.user
  };

  orders[orderId] = order;

  broadcast({
    type: 'new_order',
    order
  });

  ws.send(JSON.stringify({
    type: 'order_ack',
    orderId
  }));
}

function handleStatusUpdate(data) {
  const order = orders[data.orderId];
  if (!order) return;

  order.status = data.status;

  broadcast({
    type: 'status_update',
    orderId: data.orderId,
    status: data.status
  });
}

function broadcast(message) {
  const msg = JSON.stringify(message);
  for (const conn of connections) {
    if (conn.readyState === WebSocket.OPEN) {
      conn.send(msg);
    }
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
