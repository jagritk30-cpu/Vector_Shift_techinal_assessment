// components/Spotlight.js
// ⌘K Command Palette — search and add any node type to the canvas center

import { useState, useEffect, useRef } from 'react';

// ── Complete node type registry ────────────────────────────────
const ALL_NODES = [
  {
    type: 'customInput',
    label: 'Input',
    icon: '⬇',
    desc: 'Pipeline input source — Text, File, Image, JSON',
    category: 'I/O',
    color: '#10b981',
  },
  {
    type: 'customOutput',
    label: 'Output',
    icon: '⬆',
    desc: 'Pipeline output sink — Text, Image, File, JSON',
    category: 'I/O',
    color: '#06b6d4',
  },
  {
    type: 'llm',
    label: 'LLM',
    icon: '🧠',
    desc: 'Large language model — GPT-4o, Claude, Gemini and more',
    category: 'AI',
    color: '#6366f1',
  },
  {
    type: 'text',
    label: 'Text',
    icon: '📝',
    desc: 'Text template with dynamic {{variable}} handles',
    category: 'Processing',
    color: '#8b5cf6',
  },
  {
    type: 'math',
    label: 'Math',
    icon: '🔢',
    desc: 'Arithmetic operations: Add, Subtract, Multiply, Divide',
    category: 'Processing',
    color: '#f43f5e',
  },
  {
    type: 'api',
    label: 'API Call',
    icon: '🌐',
    desc: 'HTTP API call — GET, POST, PUT, PATCH, DELETE',
    category: 'Processing',
    color: '#f97316',
  },
  {
    type: 'filter',
    label: 'Filter',
    icon: '🔍',
    desc: 'Conditional routing — pass/fail based on field value',
    category: 'Flow',
    color: '#06b6d4',
  },
  {
    type: 'merge',
    label: 'Merge',
    icon: '🔀',
    desc: 'Combine 2–4 inputs with concat, JSON merge, or zip',
    category: 'Flow',
    color: '#6366f1',
  },
  {
    type: 'note',
    label: 'Note',
    icon: '📌',
    desc: 'Sticky note annotation for documenting pipeline steps',
    category: 'Utils',
    color: '#f59e0b',
  },
];

// ── Score a node against a search query (fuzzy-ish) ────────────
function scoreNode(node, q) {
  const query = q.toLowerCase();
  if (node.label.toLowerCase() === query) return 100;
  if (node.label.toLowerCase().startsWith(query)) return 80;
  if (node.label.toLowerCase().includes(query)) return 60;
  if (node.category.toLowerCase().includes(query)) return 40;
  if (node.desc.toLowerCase().includes(query)) return 20;
  return 0;
}

export const Spotlight = ({ isOpen, onClose, onAddNode }) => {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Filtered + sorted results
  const results =
    query.trim() === ''
      ? ALL_NODES
      : ALL_NODES.map((n) => ({ ...n, score: scoreNode(n, query) }))
          .filter((n) => n.score > 0)
          .sort((a, b) => b.score - a.score);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  // Reset selection on query change
  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const item = list.querySelector('.spotlight-item-selected');
    item?.scrollIntoView({ block: 'nearest' });
  }, [selectedIdx]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const node = results[selectedIdx];
      if (node) { onAddNode(node.type); onClose(); }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleAdd = (type) => {
    onAddNode(type);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="spotlight-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Node search">
      <div className="spotlight-card" onClick={(e) => e.stopPropagation()}>

        {/* Search input */}
        <div className="spotlight-input-wrapper">
          <span className="spotlight-search-icon">⌕</span>
          <input
            ref={inputRef}
            id="spotlight-search"
            className="spotlight-input"
            type="text"
            placeholder="Search nodes… e.g. LLM, Filter, API"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
          />
          {query && (
            <button
              className="spotlight-clear-btn"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Results list */}
        <div className="spotlight-results" ref={listRef}>
          {results.length === 0 ? (
            <div className="spotlight-empty">
              <span style={{ fontSize: 24 }}>🔍</span>
              <div>No nodes match <strong>"{query}"</strong></div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Try: LLM, Input, Filter, API…</div>
            </div>
          ) : (
            <>
              {!query && (
                <div className="spotlight-section-label">All nodes</div>
              )}
              {results.map((node, idx) => (
                <button
                  key={node.type}
                  className={`spotlight-item${idx === selectedIdx ? ' spotlight-item-selected' : ''}`}
                  onClick={() => handleAdd(node.type)}
                  onMouseEnter={() => setSelectedIdx(idx)}
                  tabIndex={-1}
                  aria-label={`Add ${node.label} node`}
                >
                  <span
                    className="spotlight-item-icon"
                    style={{ background: `${node.color}20`, borderColor: `${node.color}40` }}
                  >
                    {node.icon}
                  </span>
                  <div className="spotlight-item-content">
                    <span className="spotlight-item-label">{node.label}</span>
                    <span className="spotlight-item-desc">{node.desc}</span>
                  </div>
                  <div className="spotlight-item-right">
                    <span
                      className="spotlight-item-category"
                      style={{ borderColor: `${node.color}40`, color: node.color }}
                    >
                      {node.category}
                    </span>
                    {idx === selectedIdx && (
                      <kbd className="spotlight-enter-key">↵</kbd>
                    )}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="spotlight-footer">
          <div className="spotlight-footer-hints">
            <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
            <span><kbd>↵</kbd> Add to canvas</span>
            <span><kbd>ESC</kbd> Close</span>
          </div>
          <span className="spotlight-count">
            {results.length} node{results.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
