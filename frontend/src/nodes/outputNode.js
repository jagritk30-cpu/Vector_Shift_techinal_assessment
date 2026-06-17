// outputNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace('customOutput-', 'output_')
  );
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  const handles = [
    {
      id: `${id}-value`,
      type: 'target',
      position: Position.Left,
    },
  ];

  return (
    <BaseNode
      id={id}
      type="customOutput"
      label="Output"
      icon="⬆"
      badge="Out"
      badgeClass="badge-cyan"
      handles={handles}
    >
      <div className="node-field">
        <label className="node-field-label">Name</label>
        <input
          type="text"
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
          placeholder="output_name"
        />
      </div>

      <div className="node-field">
        <label className="node-field-label">Type</label>
        <select value={outputType} onChange={(e) => setOutputType(e.target.value)}>
          <option value="Text">📝 Text</option>
          <option value="Image">🖼 Image</option>
          <option value="File">📁 File</option>
          <option value="JSON">📦 JSON</option>
        </select>
      </div>
    </BaseNode>
  );
};
