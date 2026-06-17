// BaseNode.js
// Reusable abstraction for all pipeline nodes — handles styling, header, and handle rendering.

import { Handle } from 'reactflow';

/**
 * BaseNode — shared foundation for all node types.
 *
 * Props:
 *  id         — node id (from ReactFlow)
 *  type       — node type key (e.g. 'llm', 'customInput')
 *  label      — display title shown in the header
 *  icon       — emoji or icon string for the header
 *  badge      — badge label text (e.g. "Input", "AI")
 *  badgeClass — CSS class for badge color (e.g. "badge-emerald")
 *  handles    — array of handle descriptors:
 *               { id, type: 'source'|'target', position, style, label }
 *  children   — node body content (fields, selects, textareas)
 *  style      — optional extra inline style for the wrapper
 *  minWidth   — optional minimum width override
 */
export const BaseNode = ({
  id,
  type = 'default',
  label = 'Node',
  icon = '⬡',
  badge,
  badgeClass = 'badge-purple',
  handles = [],
  children,
  style = {},
  minWidth = 220,
}) => {
  return (
    <div
      className={`base-node node-type-${type}`}
      style={{ minWidth, ...style }}
    >
      {/* Accent top border handled by CSS ::before */}

      {/* Header */}
      <div className="node-header">
        <span className="node-header-icon">{icon}</span>
        <span className="node-header-title">{label}</span>
        {badge && (
          <span className={`node-header-badge ${badgeClass}`}>{badge}</span>
        )}
      </div>

      {/* Body */}
      <div className="node-body">
        {children}
      </div>

      {/* Handles */}
      {handles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={h.position}
          id={h.id}
          style={h.style || {}}
        />
      ))}
    </div>
  );
};
