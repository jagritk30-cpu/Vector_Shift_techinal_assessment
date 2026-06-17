// filterNode.js — Filters data based on a configurable condition/key

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const [field, setField] = useState(data?.field || 'field_name');
  const [operator, setOperator] = useState(data?.operator || 'equals');
  const [value, setValue] = useState(data?.value || '');

  const handles = [
    {
      id: `${id}-input`,
      type: 'target',
      position: Position.Left,
    },
    {
      id: `${id}-pass`,
      type: 'source',
      position: Position.Right,
      style: { top: '35%' },
    },
    {
      id: `${id}-fail`,
      type: 'source',
      position: Position.Right,
      style: { top: '65%' },
    },
  ];

  return (
    <BaseNode
      id={id}
      type="filter"
      label="Filter"
      icon="🔍"
      badge="Logic"
      badgeClass="badge-cyan"
      handles={handles}
      minWidth={230}
    >
      <div className="node-field">
        <label className="node-field-label">Field</label>
        <input
          type="text"
          value={field}
          onChange={(e) => setField(e.target.value)}
          placeholder="data.field"
        />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div className="node-field" style={{ flex: '0 0 110px' }}>
          <label className="node-field-label">Operator</label>
          <select value={operator} onChange={(e) => setOperator(e.target.value)}>
            <option value="equals">= Equals</option>
            <option value="not_equals">≠ Not Equals</option>
            <option value="contains">⊃ Contains</option>
            <option value="greater_than">&gt; Greater Than</option>
            <option value="less_than">&lt; Less Than</option>
            <option value="exists">∃ Exists</option>
          </select>
        </div>

        <div className="node-field" style={{ flex: 1 }}>
          <label className="node-field-label">Value</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="value"
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        <span>✅ Pass →</span>
        <span>❌ Fail →</span>
      </div>
    </BaseNode>
  );
};
