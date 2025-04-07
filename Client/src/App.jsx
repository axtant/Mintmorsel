import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import Signup from './pages/signup/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import Cart from './pages/cart/Cart';
import ConfirmPayments from './pages/confirmPayments/Confirm';
import AdminDashboard from './components/AdminDashboard';
import { CartProvider } from './context/CartContext';


function App() {

  
  return (

    <CartProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/confirm-payments" element={<ConfirmPayments />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
      </Routes>
    </Router>
    </CartProvider>
    
  );
}

export default App;
