// apiNode.js — Makes HTTP API calls with configurable method and URL

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export const ApiNode = ({ id, data }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [url, setUrl] = useState(data?.url || 'https://api.example.com/endpoint');

  const handles = [
    {
      id: `${id}-body`,
      type: 'target',
      position: Position.Left,
      style: { top: '40%' },
    },
    {
      id: `${id}-headers`,
      type: 'target',
      position: Position.Left,
      style: { top: '65%' },
    },
    {
      id: `${id}-response`,
      type: 'source',
      position: Position.Right,
    },
  ];

  const methodColors = {
    GET: 'var(--accent-emerald)',
    POST: 'var(--accent-primary)',
    PUT: 'var(--accent-amber)',
    PATCH: 'var(--accent-orange)',
    DELETE: 'var(--accent-rose)',
  };

  return (
    <BaseNode
      id={id}
      type="api"
      label="API Call"
      icon="🌐"
      badge="HTTP"
      badgeClass="badge-orange"
      handles={handles}
      minWidth={240}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="node-field" style={{ flex: '0 0 80px' }}>
          <label className="node-field-label">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{ color: methodColors[method] || 'inherit' }}
          >
            {HTTP_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="node-field" style={{ flex: 1 }}>
          <label className="node-field-label">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="node-info-row">
        <span className="info-icon">📡</span>
        <span>Body + Headers → Response</span>
      </div>
    </BaseNode>
  );
};
