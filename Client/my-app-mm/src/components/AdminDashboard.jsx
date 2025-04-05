import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        if (receivedData.type === 'order_received') {
            setOrders((prevOrders) => [...prevOrders, receivedData]);
            console.log('Order received:', receivedData);
        }
    };
    

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    console.log('Orders updated:', orders);
  }, [orders]);

//   const handleConfirm = (orderId) => {
//     ws.send(JSON.stringify({ type: 'order_confirmed', orderId }));
//     console.log(`Order ${orderId} confirmed`);
//   };

//   const handleDecline = (orderId) => {
//     ws.send(JSON.stringify({ type: 'order_declined', orderId }));
//     console.log(`Order ${orderId} declined`);
//   };


  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="orders">
        {orders.length === 0 ? (
          <p>No orders received yet</p>
        ) : (
            orders.map((order, index) => (
                <div key={index}>
                    <h2>Order #{index + 1}</h2>
                    <p>Items: {order.items.join(', ')}</p>
                    <p>Amount: ₹{order.amount}</p>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
