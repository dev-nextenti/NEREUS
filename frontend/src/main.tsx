import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'

// Permanent 24/7 Cloud Backend (Render.com)
const PROD_BACKEND_URL = "https://nereus-marine-intelligence-ptz2.onrender.com";

// Intercept all fetch requests to route to live backend on static hosts and bypass ngrok warning
const originalFetch = window.fetch;
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  let targetUrl = input;
  if (typeof input === 'string' && input.startsWith('/api')) {
    const isLocalOrSameOrigin =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.origin.includes('ngrok-free.app');
    if (!isLocalOrSameOrigin) {
      targetUrl = `${PROD_BACKEND_URL}${input}`;
    }
  }

  const initObj = init ? { ...init } : {};
  const headers = new Headers(initObj.headers || {});
  headers.set('ngrok-skip-browser-warning', 'true');
  initObj.headers = headers;
  return originalFetch(targetUrl, initObj);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
