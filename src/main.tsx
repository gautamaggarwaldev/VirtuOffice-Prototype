/* eslint-disable @typescript-eslint/no-require-imports */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';
import App from './App.tsx';
import './index.css';

// Polyfills for Node.js globals needed by simple-peer
window.global = window;
window.process = window.process || { env: {}, browser: true };
globalThis.Buffer = globalThis.Buffer || Buffer;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);