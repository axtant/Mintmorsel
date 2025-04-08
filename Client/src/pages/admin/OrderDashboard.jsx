// src/components/OrderDashboard.jsx
import React, { useState, useEffect } from 'react';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'order_received') {
        setOrders(prev => [...prev, data]);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="order-section bg-white shadow p-4 rounded">
      <h2 className="text-xl font-semibold mb-4">Order Management</h2>
      
      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No pending orders</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-item border-b pb-4 mb-4">
              <h3 className="font-bold">Order #{index + 1}</h3>
              <p>Items: {order.items.join(', ')}</p>
              <p>Total: ₹{order.amount}</p>
              <div className="flex gap-2 mt-2">
                <button 
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Confirm
                </button>
                <button 
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderDashboard;
