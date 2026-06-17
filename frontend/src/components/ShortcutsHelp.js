// components/ShortcutsHelp.js — Keyboard shortcuts help overlay panel

const SHORTCUTS = [
  {
    category: 'Pipeline',
    items: [
      { keys: ['⌘', 'K'], label: 'Open spotlight / add node' },
      { keys: ['⌘', 'S'], label: 'Save pipeline' },
      { keys: ['⌘', 'E'], label: 'Export pipeline as JSON' },
      { keys: ['⌘', 'Z'], label: 'Undo' },
      { keys: ['⌘', '⇧', 'Z'], label: 'Redo' },
    ],
  },
  {
    category: 'Selection',
    items: [
      { keys: ['⌘', 'A'], label: 'Select all nodes' },
      { keys: ['⌘', 'D'], label: 'Duplicate selected node(s)' },
      { keys: ['Del'], label: 'Delete selected node or edge' },
      { keys: ['Esc'], label: 'Deselect / close panels' },
    ],
  },
  {
    category: 'Canvas',
    items: [
      { keys: ['Scroll'], label: 'Zoom in / out' },
      { keys: ['Space', 'Drag'], label: 'Pan canvas' },
      { keys: ['Right-click'], label: 'Context menu' },
      { keys: ['?'], label: 'Toggle this help panel' },
    ],
  },
];

export const ShortcutsHelp = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
      <div className="shortcuts-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="shortcuts-header">
          <div>
            <div className="modal-title">Keyboard Shortcuts</div>
            <div className="modal-subtitle">Master the pipeline builder</div>
          </div>
          <button className="shortcuts-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Shortcut groups */}
        <div className="shortcuts-body">
          {SHORTCUTS.map((group) => (
            <div key={group.category} className="shortcuts-group">
              <div className="shortcuts-group-title">{group.category}</div>
              {group.items.map((item) => (
                <div key={item.label} className="shortcuts-row">
                  <div className="shortcuts-keys">
                    {item.keys.map((key, i) => (
                      <span key={i}>
                        <kbd className="shortcut-key">{key}</kbd>
                        {i < item.keys.length - 1 && (
                          <span className="shortcut-plus">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="shortcuts-label">{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="shortcuts-footer">
          Press <kbd className="shortcut-key">?</kbd> to toggle this panel
        </div>
      </div>
    </div>
  );
};
