// hooks/useKeyboardShortcuts.js — Global keyboard shortcut handler

import { useEffect, useCallback } from 'react';

const isMac = () =>
  typeof navigator !== 'undefined' &&
  navigator.platform.toUpperCase().includes('MAC');

/**
 * Attach global keyboard shortcuts.
 *
 * All handlers are optional. Pass null / undefined to disable a shortcut.
 */
export const useKeyboardShortcuts = ({
  onUndo,
  onRedo,
  onDeleteSelected,
  onDuplicateSelected,
  onExport,
  onSelectAll,
  onSpotlight,
  onHelp,
  onClearCanvas,
  onSave,
  onEscape,
}) => {
  const handler = useCallback(
    (e) => {
      const ctrlCmd = isMac() ? e.metaKey : e.ctrlKey;
      const target  = e.target;
      // Don't intercept shortcuts when user is typing in an input or textarea
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true';

      // ── ⌘Z / Ctrl+Z → Undo ──────────────────────────────
      if (ctrlCmd && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        onUndo?.();
        return;
      }

      // ── ⌘⇧Z / Ctrl+Shift+Z / Ctrl+Y → Redo ─────────────
      if (
        (ctrlCmd && e.shiftKey && e.key === 'z') ||
        (ctrlCmd && e.key === 'y')
      ) {
        e.preventDefault();
        onRedo?.();
        return;
      }

      // ── ⌘K / Ctrl+K → Spotlight ─────────────────────────
      if (ctrlCmd && e.key === 'k') {
        e.preventDefault();
        onSpotlight?.();
        return;
      }

      // ── ⌘S / Ctrl+S → Save ──────────────────────────────
      if (ctrlCmd && e.key === 's') {
        e.preventDefault();
        onSave?.();
        return;
      }

      // ── ⌘E / Ctrl+E → Export ────────────────────────────
      if (ctrlCmd && e.key === 'e') {
        e.preventDefault();
        onExport?.();
        return;
      }

      // ── ⌘A / Ctrl+A → Select All (not in inputs) ────────
      if (ctrlCmd && e.key === 'a' && !isTyping) {
        e.preventDefault();
        onSelectAll?.();
        return;
      }

      // ── ⌘D / Ctrl+D → Duplicate selected ────────────────
      if (ctrlCmd && e.key === 'd' && !isTyping) {
        e.preventDefault();
        onDuplicateSelected?.();
        return;
      }

      // ── Delete / Backspace → Delete selected ─────────────
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTyping) {
        e.preventDefault();
        onDeleteSelected?.();
        return;
      }

      // ── ? → Toggle help ──────────────────────────────────
      if (e.key === '?' && !isTyping) {
        onHelp?.();
        return;
      }

      // ── Escape → Close modals / deselect ─────────────────
      if (e.key === 'Escape') {
        onEscape?.();
        return;
      }
    },
    [onUndo, onRedo, onDeleteSelected, onDuplicateSelected, onExport,
     onSelectAll, onSpotlight, onHelp, onSave, onEscape]
  );

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
};
