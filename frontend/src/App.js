// App.js — Root orchestrator: wires up all features (shortcuts, spotlight, save/load, export)

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

import { PipelineToolbar } from './toolbar';
import { PipelineUI }      from './ui';
import { SubmitButton }    from './submit';

import { Spotlight }      from './components/Spotlight';
import { ShortcutsHelp }  from './components/ShortcutsHelp';
import { ToastContainer, showToast } from './components/Toast';

import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { savePipeline, loadPipeline } from './utils/persistence';
import { exportPipeline, importPipelineViaFilePicker } from './utils/exportImport';

import './index.css';

// ── Store selector ─────────────────────────────────────────────
const selector = (state) => ({
  nodes:              state.nodes,
  edges:              state.edges,
  undo:               state.undo,
  redo:               state.redo,
  deleteSelected:     state.deleteSelected,
  duplicateSelected:  state.duplicateSelected,
  selectAll:          state.selectAll,
  clearCanvas:        state.clearCanvas,
  loadState:          state.loadState,
  addNode:            state.addNode,
  getNodeID:          state.getNodeID,
  reactFlowInstance:  state.reactFlowInstance,
  past:               state.past,
  future:             state.future,
});

function App() {
  const {
    nodes, edges,
    undo, redo,
    deleteSelected, duplicateSelected, selectAll,
    loadState, addNode, getNodeID,
    reactFlowInstance,
    past, future,
  } = useStore(selector, shallow);

  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [helpOpen,      setHelpOpen]      = useState(false);
  const [savedAt,       setSavedAt]       = useState(null);
  const autoSaveTimer = useRef(null);

  // ── Load saved pipeline on first mount ────────────────────────
  useEffect(() => {
    const saved = loadPipeline();
    if (saved && saved.nodes.length > 0) {
      loadState(saved.nodes, saved.edges);
      setSavedAt(saved.savedAt);
      showToast(`🔄 Pipeline restored (${saved.nodes.length} nodes)`, 'info', 3000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-save: debounce 1.5 seconds after changes ─────────────
  useEffect(() => {
    if (nodes.length === 0 && edges.length === 0) return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      const ok = savePipeline(nodes, edges);
      if (ok) setSavedAt(Date.now());
    }, 1500);
    return () => clearTimeout(autoSaveTimer.current);
  }, [nodes, edges]);

  // ── Add node at canvas center (used by Spotlight) ─────────────
  const addNodeAtCenter = useCallback((type) => {
    if (!reactFlowInstance) return;
    const { x, y, zoom } = reactFlowInstance.getViewport();
    // Convert viewport center to flow coordinates
    const centerX = (-x + window.innerWidth  / 2) / zoom;
    const centerY = (-y + window.innerHeight / 2) / zoom;
    const nodeID  = getNodeID(type);
    addNode({
      id:       nodeID,
      type,
      position: { x: centerX - 120, y: centerY - 60 },
      data:     { id: nodeID, nodeType: type },
    });
    showToast(`✅ ${type.replace('custom', '')} node added`, 'success');
  }, [reactFlowInstance, getNodeID, addNode]);

  // ── Undo / Redo with toast feedback ──────────────────────────
  const handleUndo = useCallback(() => {
    const ok = undo();
    if (ok) showToast('↩ Undone', 'default');
    else    showToast('Nothing to undo', 'warning');
  }, [undo]);

  const handleRedo = useCallback(() => {
    const ok = redo();
    if (ok) showToast('↪ Redone', 'default');
    else    showToast('Nothing to redo', 'warning');
  }, [redo]);

  // ── Delete selected ───────────────────────────────────────────
  const handleDeleteSelected = useCallback(() => {
    const ok = deleteSelected();
    if (ok) showToast('🗑 Deleted', 'default');
  }, [deleteSelected]);

  // ── Duplicate selected ────────────────────────────────────────
  const handleDuplicateSelected = useCallback(() => {
    const ok = duplicateSelected();
    if (ok) showToast('⧉ Duplicated', 'success');
    else    showToast('Select a node to duplicate', 'warning');
  }, [duplicateSelected]);

  // ── Select all ────────────────────────────────────────────────
  const handleSelectAll = useCallback(() => {
    selectAll();
    showToast(`☑ Selected all ${nodes.length} nodes`, 'default');
  }, [selectAll, nodes.length]);

  // ── Export ────────────────────────────────────────────────────
  const handleExport = useCallback(() => {
    if (nodes.length === 0) {
      showToast('Add nodes before exporting', 'warning');
      return;
    }
    exportPipeline(nodes, edges);
    showToast('⬆ Pipeline exported as JSON', 'success');
  }, [nodes, edges]);

  // ── Import ────────────────────────────────────────────────────
  const handleImport = useCallback(async () => {
    try {
      const { nodes: importedNodes, edges: importedEdges } = await importPipelineViaFilePicker();
      loadState(importedNodes, importedEdges);
      showToast(`⬇ Imported ${importedNodes.length} nodes`, 'success', 3000);
    } catch (err) {
      showToast(`❌ Import failed: ${err.message}`, 'error', 4000);
    }
  }, [loadState]);

  // ── Manual save ──────────────────────────────────────────────
  const handleManualSave = useCallback(() => {
    const ok = savePipeline(nodes, edges);
    if (ok) {
      setSavedAt(Date.now());
      showToast('💾 Pipeline saved', 'success');
    } else {
      showToast('❌ Save failed (storage full?)', 'error');
    }
  }, [nodes, edges]);

  // ── Escape handler ────────────────────────────────────────────
  const handleEscape = useCallback(() => {
    setSpotlightOpen(false);
    setHelpOpen(false);
  }, []);

  // ── Register keyboard shortcuts ───────────────────────────────
  useKeyboardShortcuts({
    onUndo:               handleUndo,
    onRedo:               handleRedo,
    onDeleteSelected:     handleDeleteSelected,
    onDuplicateSelected:  handleDuplicateSelected,
    onSelectAll:          handleSelectAll,
    onExport:             handleExport,
    onSpotlight:          () => setSpotlightOpen((o) => !o),
    onHelp:               () => setHelpOpen((o) => !o),
    onSave:               handleManualSave,
    onEscape:             handleEscape,
  });

  // ── Saved-at label ─────────────────────────────────────────────
  const savedLabel = savedAt
    ? `Saved ${new Date(savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Unsaved';

  return (
    <div className="app-wrapper">
      {/* ── Header ───────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-brand">
          <div className="header-logo">⚡</div>
          <div>
            <div className="header-title">VectorShift</div>
          </div>
        </div>

        {/* Center: header actions */}
        <div className="header-actions">
          {/* Undo / Redo */}
          <button
            id="undo-btn"
            className="header-icon-btn"
            onClick={handleUndo}
            disabled={past.length === 0}
            title="Undo (⌘Z)"
            aria-label="Undo"
          >
            ↩
          </button>
          <button
            id="redo-btn"
            className="header-icon-btn"
            onClick={handleRedo}
            disabled={future.length === 0}
            title="Redo (⌘Y)"
            aria-label="Redo"
          >
            ↪
          </button>

          <div className="header-divider" />

          {/* Spotlight trigger */}
          <button
            id="spotlight-btn"
            className="header-spotlight-btn"
            onClick={() => setSpotlightOpen(true)}
            title="Add node (⌘K)"
          >
            <span>⌕ Add Node</span>
            <kbd>⌘K</kbd>
          </button>

          <div className="header-divider" />

          {/* Export */}
          <button
            id="export-btn"
            className="header-icon-btn"
            onClick={handleExport}
            title="Export pipeline (⌘E)"
            aria-label="Export"
          >
            ⬆
          </button>
          {/* Import */}
          <button
            id="import-btn"
            className="header-icon-btn"
            onClick={handleImport}
            title="Import pipeline"
            aria-label="Import"
          >
            ⬇
          </button>

          <div className="header-divider" />

          {/* Save */}
          <button
            id="save-btn"
            className="header-save-btn"
            onClick={handleManualSave}
            title="Save (⌘S)"
          >
            💾 Save
          </button>
        </div>

        {/* Right: status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="header-saved-label">{savedLabel}</span>

          <button
            id="help-btn"
            className="header-icon-btn"
            onClick={() => setHelpOpen(true)}
            title="Keyboard shortcuts (?)"
            aria-label="Keyboard shortcuts"
          >
            ?
          </button>

          <div className="header-status">
            <div className="status-dot" />
            <span>{nodes.length} nodes · {edges.length} edges</span>
          </div>
        </div>
      </header>

      {/* ── Main canvas area ──────────────────────────────────── */}
      <main className="canvas-area">
        {/* Floating toolbar dock */}
        <PipelineToolbar />

        {/* ReactFlow canvas */}
        <PipelineUI
          onSpotlightOpen={() => setSpotlightOpen(true)}
          onExport={handleExport}
          onImport={handleImport}
        />

        {/* Floating submit button */}
        <SubmitButton />
      </main>

      {/* ── Overlays & Modals ─────────────────────────────────── */}
      <Spotlight
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        onAddNode={addNodeAtCenter}
      />

      <ShortcutsHelp
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />

      {/* Toast notification container */}
      <ToastContainer />
    </div>
  );
}

export default App;
