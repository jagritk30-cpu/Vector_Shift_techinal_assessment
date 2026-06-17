// ui.js — ReactFlow canvas with context menu, drag-stop snapshot, and edge selection

import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { ContextMenu } from './components/ContextMenu';

// Node type imports
import { InputNode }   from './nodes/inputNode';
import { LLMNode }     from './nodes/llmNode';
import { OutputNode }  from './nodes/outputNode';
import { TextNode }    from './nodes/textNode';
import { NoteNode }    from './nodes/noteNode';
import { MathNode }    from './nodes/mathNode';
import { ApiNode }     from './nodes/apiNode';
import { FilterNode }  from './nodes/filterNode';
import { MergeNode }   from './nodes/mergeNode';

import 'reactflow/dist/style.css';

const gridSize   = 16;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput:  InputNode,
  llm:          LLMNode,
  customOutput: OutputNode,
  text:         TextNode,
  note:         NoteNode,
  math:         MathNode,
  api:          ApiNode,
  filter:       FilterNode,
  merge:        MergeNode,
};

const selector = (state) => ({
  nodes:                state.nodes,
  edges:                state.edges,
  getNodeID:            state.getNodeID,
  addNode:              state.addNode,
  onNodesChange:        state.onNodesChange,
  onEdgesChange:        state.onEdgesChange,
  onConnect:            state.onConnect,
  onNodeDragStop:       state.onNodeDragStop,
  deleteNode:           state.deleteNode,
  duplicateNode:        state.duplicateNode,
  clearCanvas:          state.clearCanvas,
  selectAll:            state.selectAll,
  undo:                 state.undo,
  redo:                 state.redo,
  setReactFlowInstance: state.setReactFlowInstance,
});

export const PipelineUI = ({ onSpotlightOpen, onExport, onImport }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setInstanceLocal] = useState(null);

  // Context menu state
  const [ctxMenu, setCtxMenu] = useState(null); // { x, y, menuType, nodeId? }

  const {
    nodes, edges,
    getNodeID, addNode,
    onNodesChange, onEdgesChange, onConnect,
    onNodeDragStop,
    deleteNode, duplicateNode, clearCanvas, selectAll,
    undo, redo,
    setReactFlowInstance,
  } = useStore(selector, shallow);

  // Keep both local state and store in sync
  const handleInit = useCallback((instance) => {
    setInstanceLocal(instance);
    setReactFlowInstance(instance);
  }, [setReactFlowInstance]);

  // ── Drag & Drop ─────────────────────────────────────────────
  const getInitNodeData = (nodeID, type) => ({ id: nodeID, nodeType: type });

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const rawData = event?.dataTransfer?.getData('application/reactflow');
      if (!rawData) return;
      const appData = JSON.parse(rawData);
      const type = appData?.nodeType;
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID  = getNodeID(type);
      addNode({ id: nodeID, type, position, data: getInitNodeData(nodeID, type) });
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // ── Context Menu ─────────────────────────────────────────────
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setCtxMenu({ x: event.clientX, y: event.clientY, menuType: 'node', nodeId: node.id });
  }, []);

  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    setCtxMenu({ x: event.clientX, y: event.clientY, menuType: 'canvas' });
  }, []);

  const closeCtxMenu = useCallback(() => setCtxMenu(null), []);

  const handleContextAction = useCallback((actionId, nodeId) => {
    switch (actionId) {
      case 'delete':      deleteNode(nodeId);   break;
      case 'duplicate':   duplicateNode(nodeId); break;
      case 'select-all':  selectAll();           break;
      case 'undo':        undo();                break;
      case 'redo':        redo();                break;
      case 'clear':
        if (window.confirm('Clear the entire canvas? This cannot be undone easily.')) {
          clearCanvas();
        }
        break;
      case 'spotlight':   onSpotlightOpen?.(); break;
      case 'export':      onExport?.();        break;
      case 'import':      onImport?.();        break;
      default: break;
    }
  }, [deleteNode, duplicateNode, selectAll, undo, redo, clearCanvas, onSpotlightOpen, onExport, onImport]);

  // ── Node drag stop → take snapshot for undo ──────────────────
  const handleNodeDragStop = useCallback(() => {
    onNodeDragStop();
  }, [onNodeDragStop]);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={handleInit}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onNodeDragStop={handleNodeDragStop}
        onPaneClick={closeCtxMenu}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType="smoothstep"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'rgba(99,102,241,0.65)', strokeWidth: 1.5 },
          markerEnd: { type: 'arrow', width: 20, height: 20, color: 'rgba(99,102,241,0.8)' },
        }}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        deleteKeyCode={null}   // Prevent ReactFlow from handling Delete (we handle it ourselves)
        multiSelectionKeyCode="Shift"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={gridSize}
          size={1}
          color="rgba(148,163,184,0.12)"
        />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const colors = {
              customInput:  '#10b981',
              llm:          '#6366f1',
              customOutput: '#06b6d4',
              text:         '#8b5cf6',
              note:         '#f59e0b',
              math:         '#f43f5e',
              api:          '#f97316',
              filter:       '#06b6d4',
              merge:        '#6366f1',
            };
            return colors[node.type] || '#94a3b8';
          }}
          maskColor="rgba(7,11,20,0.75)"
          style={{ borderRadius: 'var(--radius-md)' }}
        />
      </ReactFlow>

      {/* Context menu */}
      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          menuType={ctxMenu.menuType}
          nodeId={ctxMenu.nodeId}
          onClose={closeCtxMenu}
          onAction={handleContextAction}
        />
      )}
    </div>
  );
};
