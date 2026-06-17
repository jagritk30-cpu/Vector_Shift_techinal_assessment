// noteNode.js — Annotation / sticky note for pipeline documentation

import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || 'Add your note here...');

  // No handles — this is a pure annotation node
  const handles = [];

  return (
    <BaseNode
      id={id}
      type="note"
      label="Note"
      icon="📌"
      badge="Annotation"
      badgeClass="badge-amber"
      handles={handles}
      minWidth={200}
    >
      <div className="node-field">
        <textarea
          className="note-node-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Document your pipeline step here..."
          rows={4}
          style={{
            width: '100%',
            minHeight: '80px',
            resize: 'none',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            lineHeight: '1.6',
            outline: 'none',
          }}
        />
      </div>
    </BaseNode>
  );
};
