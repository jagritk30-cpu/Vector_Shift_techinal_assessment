// toolbar.js — Premium floating toolbar with categorized, draggable node chips

import { DraggableNode } from './draggableNode';

const NODE_CATEGORIES = [
  {
    label: 'I/O',
    nodes: [
      { type: 'customInput',  label: 'Input',  icon: '⬇' },
      { type: 'customOutput', label: 'Output', icon: '⬆' },
    ],
  },
  {
    label: 'Processing',
    nodes: [
      { type: 'llm',    label: 'LLM',    icon: '🧠' },
      { type: 'text',   label: 'Text',   icon: '📝' },
      { type: 'math',   label: 'Math',   icon: '🔢' },
      { type: 'api',    label: 'API',    icon: '🌐' },
    ],
  },
  {
    label: 'Flow',
    nodes: [
      { type: 'filter', label: 'Filter', icon: '🔍' },
      { type: 'merge',  label: 'Merge',  icon: '🔀' },
    ],
  },
  {
    label: 'Utils',
    nodes: [
      { type: 'note',   label: 'Note',   icon: '📌' },
    ],
  },
];

export const PipelineToolbar = () => {
  return (
    <div className="toolbar-container">
      <div className="toolbar-label">Nodes</div>
      <div className="toolbar-nodes">
        {NODE_CATEGORIES.map((cat, catIdx) => (
          <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {catIdx > 0 && <div className="toolbar-divider" />}
            <div className="toolbar-category">
              {cat.nodes.map((node) => (
                <DraggableNode
                  key={node.type}
                  type={node.type}
                  label={node.label}
                  icon={node.icon}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
