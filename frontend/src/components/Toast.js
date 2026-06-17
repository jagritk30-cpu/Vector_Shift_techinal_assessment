// components/Toast.js — Lightweight, zero-dependency toast notification system

import { useState, useEffect } from 'react';

// ── Singleton event bus ────────────────────────────────────────
let _listeners = [];
let _toastIdCounter = 0;

/**
 * Show a toast notification. Can be called from anywhere — no context needed.
 *
 * @param {string} message  — text or JSX content
 * @param {'default'|'success'|'error'|'info'|'warning'} type
 * @param {number} duration — ms before auto-dismiss (default 2500)
 */
export const showToast = (message, type = 'default', duration = 2500) => {
  const id = ++_toastIdCounter;
  const toast = { id, message, type };
  _listeners.forEach((fn) => fn({ action: 'add', toast }));

  setTimeout(() => {
    _listeners.forEach((fn) => fn({ action: 'remove', id }));
  }, duration);
};

// ── ToastContainer component ──────────────────────────────────
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = ({ action, toast, id }) => {
      if (action === 'add') {
        setToasts((prev) => [...prev, toast]);
      } else if (action === 'remove') {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }
    };
    _listeners.push(handler);
    return () => {
      _listeners = _listeners.filter((l) => l !== handler);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};
