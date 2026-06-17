// components/ContextMenu.js — Right-click context menu for nodes and canvas

import { useEffect, useRef } from 'react';

// ── Node right-click menu items ────────────────────────────────
const NODE_ITEMS = [
  { id: 'duplicate', icon: '⧉', label: 'Duplicate Node', shortcut: '⌘D' },
  { id: 'sep1', type: 'separator' },
  { id: 'delete', icon: '🗑', label: 'Delete Node', shortcut: 'Del', danger: true },
];

// ── Canvas (empty area) right-click menu items ─────────────────
const CANVAS_ITEMS = [
  { id: 'spotlight', icon: '⌕', label: 'Add Node…', shortcut: '⌘K', highlight: true },
  { id: 'sep1', type: 'separator' },
  { id: 'select-all', icon: '⬛', label: 'Select All', shortcut: '⌘A' },
  { id: 'undo', icon: '↩', label: 'Undo', shortcut: '⌘Z' },
  { id: 'redo', icon: '↪', label: 'Redo', shortcut: '⌘Y' },
  { id: 'sep2', type: 'separator' },
  { id: 'export', icon: '⬆', label: 'Export Pipeline…', shortcut: '⌘E' },
  { id: 'import', icon: '⬇', label: 'Import Pipeline…' },
  { id: 'sep3', type: 'separator' },
  { id: 'clear', icon: '🗑', label: 'Clear Canvas', danger: true },
];

export const ContextMenu = ({ x, y, menuType, nodeId, onClose, onAction }) => {
  const menuRef = useRef(null);
  const items = menuType === 'node' ? NODE_ITEMS : CANVAS_ITEMS;

  // Close on any outside click or Escape
  useEffect(() => {
    const handleClick = () => onClose();
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    // Small delay so the right-click that opened it doesn't immediately close it
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKey);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  // Adjust position so menu stays within viewport
  const menuWidth  = 220;
  const menuHeight = items.length * 36 + 16;
  const adjustedX  = x + menuWidth  > window.innerWidth  ? x - menuWidth  : x;
  const adjustedY  = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: adjustedX, top: adjustedY }}
      onClick={(e) => e.stopPropagation()}
      role="menu"
    >
      {/* Menu title */}
      <div className="context-menu-title">
        {menuType === 'node' ? '⬡ Node Actions' : '🎨 Canvas Actions'}
      </div>

      {items.map((item, idx) => {
        if (item.type === 'separator') {
          return <div key={`sep-${idx}`} className="context-menu-separator" />;
        }
        return (
          <button
            key={item.id}
            className={`context-menu-item${item.danger ? ' context-menu-item-danger' : ''}${item.highlight ? ' context-menu-item-highlight' : ''}`}
            onClick={() => { onAction(item.id, nodeId); onClose(); }}
            role="menuitem"
          >
            <span className="context-menu-icon">{item.icon}</span>
            <span className="context-menu-label">{item.label}</span>
            {item.shortcut && (
              <kbd className="context-menu-shortcut">{item.shortcut}</kbd>
            )}
          </button>
        );
      })}
    </div>
  );
};
