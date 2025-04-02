import { useState, useEffect } from "react";

export const useCart = () => {
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || {};
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart, [item.itemName]: (prevCart[item.itemName] || 0) + 1 };
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (item) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[item.itemName] > 1) {
        updatedCart[item.itemName] -= 1;
      } else {
        delete updatedCart[item.itemName];
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return { cartItems, setCartItems, addToCart, removeFromCart }; // ✅ Exposing setCartItems
};
