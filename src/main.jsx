import React from 'react';
import { createRoot } from 'react-dom/client';
import MHF2Full from './MHF2Full.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MHF2Full />
  </React.StrictMode>
);
