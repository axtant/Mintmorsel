import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        try {
            const parsedCart = JSON.parse(savedCart);
            setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
        } catch (error) {
            console.error('Error parsing cart data:', error);
            setCartItems([]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        setCartItems((prev) => {
            const existingItem = prev.find((ci) => ci.itemName === item.itemName);
            if (existingItem) {
                return prev.map((ci) =>
                    ci.itemName === item.itemName
                        ? { ...ci, quantity: ci.quantity + 1 }
                        : ci
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemName) => {
        setCartItems((prev) =>
            prev.reduce((acc, ci) => {
                if (ci.itemName === itemName) {
                    if (ci.quantity > 1) {
                        acc.push({ ...ci, quantity: ci.quantity - 1 });
                    }
                } else {
                    acc.push(ci);
                }
                return acc;
            }, [])
        );
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
