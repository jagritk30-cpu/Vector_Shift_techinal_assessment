// mergeNode.js — Merges multiple inputs into a single output

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const MERGE_STRATEGIES = [
  { value: 'concat', label: '📎 Concatenate' },
  { value: 'json_merge', label: '🧩 JSON Merge' },
  { value: 'zip', label: '🤐 Zip' },
  { value: 'first', label: '1️⃣ First Non-null' },
];

export const MergeNode = ({ id, data }) => {
  const [strategy, setStrategy] = useState(data?.strategy || 'concat');
  const [inputCount, setInputCount] = useState(data?.inputCount || 2);

  const maxInputs = Math.min(inputCount, 4);

  const handles = [
    // Dynamic input handles
    ...Array.from({ length: maxInputs }, (_, i) => ({
      id: `${id}-in${i + 1}`,
      type: 'target',
      position: Position.Left,
      style: { top: `${((i + 1) / (maxInputs + 1)) * 100}%` },
    })),
    // Single output
    {
      id: `${id}-output`,
      type: 'source',
      position: Position.Right,
    },
  ];

  return (
    <BaseNode
      id={id}
      type="merge"
      label="Merge"
      icon="🔀"
      badge="Combine"
      badgeClass="badge-purple"
      handles={handles}
      minWidth={220}
    >
      <div className="node-field">
        <label className="node-field-label">Strategy</label>
        <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
          {MERGE_STRATEGIES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="node-field">
        <label className="node-field-label">Input Count (2–4)</label>
        <input
          type="number"
          min={2}
          max={4}
          value={inputCount}
          onChange={(e) => setInputCount(Math.max(2, Math.min(4, Number(e.target.value))))}
        />
      </div>

      <div className="node-info-row">
        <span className="info-icon">🔀</span>
        <span>{maxInputs} inputs → merged output</span>
      </div>
    </BaseNode>
  );
};
