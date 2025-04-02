import { createContext, useContext, useState } from "react";

// ✅ Create Context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState({});

    // ✅ Add item to cart
    const addToCart = (item) => {
        setCartItems((prev) => ({
            ...prev,
            [item.itemName]: (prev[item.itemName] || 0) + 1,
        }));
    };

    // ✅ Remove item from cart
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

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

// ✅ Custom Hook
export const useCart = () => {
    return useContext(CartContext);
};
