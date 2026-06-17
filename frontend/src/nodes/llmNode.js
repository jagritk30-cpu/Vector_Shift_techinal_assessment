// llmNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4o');

  const handles = [
    {
      id: `${id}-system`,
      type: 'target',
      position: Position.Left,
      style: { top: '38%' },
    },
    {
      id: `${id}-prompt`,
      type: 'target',
      position: Position.Left,
      style: { top: '62%' },
    },
    {
      id: `${id}-response`,
      type: 'source',
      position: Position.Right,
    },
  ];

  return (
    <BaseNode
      id={id}
      type="llm"
      label="LLM"
      icon="🧠"
      badge="AI"
      badgeClass="badge-purple"
      handles={handles}
      minWidth={240}
    >
      {/* Port labels */}
      <div style={{ position: 'relative', marginBottom: 4 }}>
        <span
          className="handle-port-label"
          style={{ position: 'absolute', left: 0, top: '-18px', fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}
        >
          System ↓
        </span>
        <span
          className="handle-port-label"
          style={{ position: 'absolute', left: 0, top: '-2px', fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}
        >
          Prompt ↓
        </span>
      </div>

      <div className="node-field" style={{ marginTop: 16 }}>
        <label className="node-field-label">Model</label>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="claude-3-opus">Claude 3 Opus</option>
          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
          <option value="gemini-pro">Gemini Pro</option>
          <option value="llama-3">Llama 3</option>
        </select>
      </div>

      <div className="node-info-row">
        <span className="info-icon">⚡</span>
        <span>Connects system + prompt → response</span>
      </div>
    </BaseNode>
  );
};
