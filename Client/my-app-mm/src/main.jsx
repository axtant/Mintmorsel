import React from 'react';
import { createRoot } from 'react-dom/client'; // Use createRoot exclusively
import './index.css';
import App from './App.jsx';
import MenuProvider from './context/MenuProvider'; // Import MenuProvider

// Get the root element
const rootElement = document.getElementById('root');

// Create the root
const root = createRoot(rootElement);

// Render the app wrapped with MenuProvider inside StrictMode
root.render(
  <React.StrictMode>
    <MenuProvider>
      <App />
    </MenuProvider>
  </React.StrictMode>
);
