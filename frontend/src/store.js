// store.js — Enhanced Zustand store with undo/redo history, full CRUD, and reactflow instance

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

const HISTORY_LIMIT = 60;

export const useStore = create((set, get) => ({
  // ── Core State ────────────────────────────────────────────
  nodes: [],
  edges: [],
  nodeIDs: {},

  // ── History ───────────────────────────────────────────────
  past: [],
  future: [],

  // ── ReactFlow Instance ────────────────────────────────────
  reactFlowInstance: null,
  setReactFlowInstance: (instance) => set({ reactFlowInstance: instance }),

  // ── Snapshot (called before every mutating action) ────────
  takeSnapshot: () => {
    const { nodes, edges, past } = get();
    const snapshot = {
      nodes: nodes.map(n => ({ ...n })),
      edges: edges.map(e => ({ ...e })),
    };
    set({
      past: [...past, snapshot].slice(-HISTORY_LIMIT),
      future: [],
    });
  },

  // ── Undo / Redo ───────────────────────────────────────────
  undo: () => {
    const { past, nodes, edges, future } = get();
    if (past.length === 0) return false;
    const previous = past[past.length - 1];
    const currentSnapshot = {
      nodes: nodes.map(n => ({ ...n })),
      edges: edges.map(e => ({ ...e })),
    };
    set({
      past: past.slice(0, -1),
      future: [currentSnapshot, ...future].slice(0, HISTORY_LIMIT),
      nodes: previous.nodes,
      edges: previous.edges,
    });
    return true;
  },

  redo: () => {
    const { past, nodes, edges, future } = get();
    if (future.length === 0) return false;
    const next = future[0];
    const currentSnapshot = {
      nodes: nodes.map(n => ({ ...n })),
      edges: edges.map(e => ({ ...e })),
    };
    set({
      future: future.slice(1),
      past: [...past, currentSnapshot].slice(-HISTORY_LIMIT),
      nodes: next.nodes,
      edges: next.edges,
    });
    return true;
  },

  // ── Node ID Generator ─────────────────────────────────────
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) newIDs[type] = 0;
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  // ── Add / Connect ─────────────────────────────────────────
  addNode: (node) => {
    get().takeSnapshot();
    set({ nodes: [...get().nodes, node] });
  },

  onConnect: (connection) => {
    get().takeSnapshot();
    set({
      edges: addEdge({
        ...connection,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' },
        style: { stroke: 'rgba(99,102,241,0.7)', strokeWidth: 1.5 },
      }, get().edges),
    });
  },

  // ── ReactFlow change handlers ─────────────────────────────
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  // Called after node drag ends (for undo snapshot)
  onNodeDragStop: () => {
    get().takeSnapshot();
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    });
  },

  // ── Canvas Actions ────────────────────────────────────────
  clearCanvas: () => {
    get().takeSnapshot();
    set({ nodes: [], edges: [] });
  },

  deleteNode: (nodeId) => {
    get().takeSnapshot();
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    });
  },

  deleteEdge: (edgeId) => {
    get().takeSnapshot();
    set({ edges: get().edges.filter((e) => e.id !== edgeId) });
  },

  deleteSelected: () => {
    const { nodes, edges } = get();
    const selNodeIds = new Set(nodes.filter((n) => n.selected).map((n) => n.id));
    const selEdgeIds = new Set(edges.filter((e) => e.selected).map((e) => e.id));
    if (selNodeIds.size === 0 && selEdgeIds.size === 0) return false;
    get().takeSnapshot();
    set({
      nodes: nodes.filter((n) => !selNodeIds.has(n.id)),
      edges: edges.filter(
        (e) => !selEdgeIds.has(e.id) && !selNodeIds.has(e.source) && !selNodeIds.has(e.target)
      ),
    });
    return true;
  },

  duplicateNode: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return null;
    get().takeSnapshot();
    const newId = get().getNodeID(node.type);
    const newNode = {
      ...node,
      id: newId,
      position: { x: node.position.x + 50, y: node.position.y + 50 },
      selected: false,
      data: { ...node.data, id: newId },
    };
    set({ nodes: [...get().nodes, newNode] });
    return newId;
  },

  duplicateSelected: () => {
    const { nodes, getNodeID } = get();
    const selected = nodes.filter((n) => n.selected);
    if (selected.length === 0) return false;
    get().takeSnapshot();
    const newNodes = selected.map((node) => {
      const newId = getNodeID(node.type);
      return {
        ...node,
        id: newId,
        position: { x: node.position.x + 50, y: node.position.y + 50 },
        selected: true,
        data: { ...node.data, id: newId },
      };
    });
    set({
      nodes: [...nodes.map((n) => ({ ...n, selected: false })), ...newNodes],
    });
    return true;
  },

  selectAll: () => {
    set({ nodes: get().nodes.map((n) => ({ ...n, selected: true })) });
  },

  // ── Load / Restore ────────────────────────────────────────
  loadState: (nodes, edges) => {
    set({ nodes, edges, past: [], future: [] });
  },
}));
