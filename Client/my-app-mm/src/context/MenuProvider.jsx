import React, { useState } from 'react';
import { MenuContext } from './MenuContext';

const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, category: 'Veg', name: 'Veg Thali', price: 50 }, // Sample item
  ]);
  const [storeOpen, setStoreOpen] = useState(true);

  return (
    <MenuContext.Provider value={{ menuItems, setMenuItems, storeOpen, setStoreOpen }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuProvider;
