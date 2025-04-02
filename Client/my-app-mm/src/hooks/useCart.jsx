import { useState } from "react";

export const useCart = () => {
  const [cartItems, setCartItems] = useState({});

  const addToCart = (item) => {
    setCartItems((prev) => ({
      ...prev,
      [item.itemName]: (prev[item.itemName] || 0) + 1,
    }));
  };

  const removeFromCart = (item) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[item.itemName] > 1) {
        updatedCart[item.itemName] -= 1;
      } else {
        delete updatedCart[item.itemName];
      }
      return updatedCart;
    });
  };

  const getTotalPrice = (menuItems) => {
    return menuItems.reduce((total, item) => {
      const quantity = cartItems[item.itemName] || 0;
      return total + item.price * quantity;
    }, 0);
  };

  return { cartItems, addToCart, removeFromCart, getTotalPrice };
};
