import React, { useState } from 'react';
import { MenuContext } from './MenuContext'; // Import the context

const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [storeOpen, setStoreOpen] = useState(true);
  return (
    <MenuContext.Provider value={{ menuItems, setMenuItems, storeOpen, setStoreOpen}}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuProvider; // Export only the component
