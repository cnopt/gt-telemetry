import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js'; // errors without.js since type:module

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
  </>
);

