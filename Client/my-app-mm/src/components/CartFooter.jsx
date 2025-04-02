import { Link } from "react-router-dom";

export const CartFooter = ({ cartItems, menuItems }) => {
    return (
        <footer className="footer fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center">
            <p>
                {Object.values(cartItems).reduce((total, qty) => total + qty, 0)} items - ₹
                {Object.keys(cartItems).reduce((total, itemName) => {
                    const item = menuItems.find((menuItem) => menuItem.itemName === itemName);
                    return total + (item ? item.price * cartItems[itemName] : 0);
                }, 0).toFixed(2)}
            </p>
            <Link to="/cart" className="bg-blue-600 text-white px-4 py-2 rounded">
                View Cart
            </Link>
        </footer>
    );
};

