// inputNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace('customInput-', 'input_')
  );
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  const handles = [
    {
      id: `${id}-value`,
      type: 'source',
      position: Position.Right,
    },
  ];

  return (
    <BaseNode
      id={id}
      type="customInput"
      label="Input"
      icon="⬇"
      badge="In"
      badgeClass="badge-emerald"
      handles={handles}
    >
      <div className="node-field">
        <label className="node-field-label">Name</label>
        <input
          type="text"
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
          placeholder="input_name"
        />
      </div>

      <div className="node-field">
        <label className="node-field-label">Type</label>
        <select value={inputType} onChange={(e) => setInputType(e.target.value)}>
          <option value="Text">📝 Text</option>
          <option value="File">📁 File</option>
          <option value="Image">🖼 Image</option>
          <option value="JSON">📦 JSON</option>
        </select>
      </div>
    </BaseNode>
  );
};
