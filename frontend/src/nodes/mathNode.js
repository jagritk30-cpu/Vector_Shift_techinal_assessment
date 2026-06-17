// mathNode.js — Performs arithmetic operations on two numeric inputs

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const OPERATIONS = ['+', '−', '×', '÷', 'MOD', 'POW'];

export const MathNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || '+');

  const handles = [
    {
      id: `${id}-a`,
      type: 'target',
      position: Position.Left,
      style: { top: '35%' },
    },
    {
      id: `${id}-b`,
      type: 'target',
      position: Position.Left,
      style: { top: '65%' },
    },
    {
      id: `${id}-result`,
      type: 'source',
      position: Position.Right,
    },
  ];

  return (
    <BaseNode
      id={id}
      type="math"
      label="Math"
      icon="🔢"
      badge="Compute"
      badgeClass="badge-rose"
      handles={handles}
      minWidth={200}
    >
      {/* Port info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>A</span>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>B</span>
        </div>
        <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', alignSelf: 'center' }}>
          Result →
        </div>
      </div>

      <div className="node-field">
        <label className="node-field-label">Operation</label>
        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
          {OPERATIONS.map((op) => (
            <option key={op} value={op}>{op === '+' ? '+ Add' : op === '−' ? '− Subtract' : op === '×' ? '× Multiply' : op === '÷' ? '÷ Divide' : op === 'MOD' ? '% Modulo' : '^ Power'}</option>
          ))}
        </select>
      </div>

      <div className="node-info-row">
        <span className="info-icon">🔗</span>
        <span>A {operation} B → Result</span>
      </div>
    </BaseNode>
  );
};
