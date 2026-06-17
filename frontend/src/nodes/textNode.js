// textNode.js
// Part 3: Dynamically parses {{variable}} patterns from textarea content
// and creates corresponding target handles on the left side of the node.

import { useState, useEffect, useRef, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z_$0-9]*)\s*\}\}/g;

/**
 * Extract unique variable names from a template string.
 * e.g. "Hello {{name}}, your {{city}} is great" → ['name', 'city']
 */
function extractVariables(text) {
  const vars = new Set();
  let match;
  const regex = new RegExp(VARIABLE_REGEX.source, 'g');
  while ((match = regex.exec(text)) !== null) {
    vars.add(match[1]);
  }
  return Array.from(vars);
}

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState(() => extractVariables(data?.text || '{{input}}'));
  const textareaRef = useRef(null);

  // Re-parse variables whenever text changes
  useEffect(() => {
    const newVars = extractVariables(currText);
    setVariables(newVars);
  }, [currText]);

  // Auto-resize textarea to fit content
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [currText, autoResize]);

  const handleChange = (e) => {
    setCurrText(e.target.value);
    autoResize();
  };

  // Compute handle vertical positions evenly spaced
  const getHandleTop = (index, total) => {
    if (total === 1) return '50%';
    const spacing = 100 / (total + 1);
    return `${spacing * (index + 1)}%`;
  };

  return (
    <div
      className={`base-node node-type-text`}
      style={{ minWidth: 240, position: 'relative' }}
    >
      {/* Header */}
      <div className="node-header">
        <span className="node-header-icon">📝</span>
        <span className="node-header-title">Text</span>
        <span className="node-header-badge badge-violet">Template</span>
      </div>

      {/* Body */}
      <div className="node-body">
        <div className="node-field">
          <label className="node-field-label">Content</label>
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleChange}
            placeholder="Type text or use {{variable}} to add inputs..."
            style={{
              minHeight: '72px',
              maxHeight: '240px',
              overflowY: 'auto',
              resize: 'none',
              width: '100%',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
            }}
            rows={3}
          />
        </div>

        {/* Variable chips */}
        {variables.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {variables.map((v) => (
              <span
                key={v}
                className="dynamic-handle-label"
                style={{ position: 'relative', left: 'auto', transform: 'none' }}
              >
                {`{{${v}}}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic target handles for each extracted variable */}
      {variables.map((varName, index) => (
        <Handle
          key={`var-${varName}`}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{ top: getHandleTop(index, variables.length) }}
          title={varName}
        />
      ))}

      {/* Source handle — always one output */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
      />
    </div>
  );
};
