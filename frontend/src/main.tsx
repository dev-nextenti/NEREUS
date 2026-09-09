import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'

// Intercept all fetch requests to automatically bypass ngrok free tier warning on API calls
const originalFetch = window.fetch;
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const initObj = init ? { ...init } : {};
  const headers = new Headers(initObj.headers || {});
  headers.set('ngrok-skip-browser-warning', 'true');
  initObj.headers = headers;
  return originalFetch(input, initObj);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
