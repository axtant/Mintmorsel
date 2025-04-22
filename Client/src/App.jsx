import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import Dashboard from './pages/user/Dashboard';
import Cart from './pages/user/Cart';
import ConfirmPayments from './pages/user/Confirm';
import { CartProvider } from './context/CartContext';
import AdminDashboard from './pages/admin/AdminDashboard';
import OrderConfirmation from './pages/user/ConfirmOrder';
import OrderDashboard from './pages/admin/OrderDashboard';


function App() {

  
  return (

    <CartProvider>
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/confirm-payments" element={<ConfirmPayments />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
        <Route path= '/order-confirmation' element={<OrderConfirmation />} />
        <Route path='/order-dashboard' element={<OrderDashboard />} />
      </Routes>
    </Router>
    </CartProvider>
    
  );
}

export default App;
