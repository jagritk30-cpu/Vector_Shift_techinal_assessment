// submit.js — Part 4 frontend: sends pipeline to backend and shows a premium result modal.

import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

const ResultModal = ({ result, onClose }) => {
  const isDAG = result.is_dag;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={`modal-card ${isDAG ? 'modal-success' : 'modal-error'}`}>
        {/* Header */}
        <div className="modal-header">
          <span className="modal-icon">{isDAG ? '✅' : '🔄'}</span>
          <div>
            <div className="modal-title" id="modal-title">Pipeline Analysis</div>
            <div className="modal-subtitle">VectorShift backend parse result</div>
          </div>
        </div>

        {/* Stats */}
        <div className="modal-stats">
          <div className="modal-stat">
            <div className="stat-value">{result.num_nodes}</div>
            <div className="stat-label">Nodes</div>
          </div>
          <div className="modal-stat">
            <div className="stat-value">{result.num_edges}</div>
            <div className="stat-label">Edges</div>
          </div>
          <div className="modal-stat">
            <div className="stat-value">{isDAG ? '✓' : '✗'}</div>
            <div className="stat-label">Is DAG</div>
          </div>
        </div>

        {/* DAG status */}
        <div className={`modal-dag-status ${isDAG ? 'dag-valid' : 'dag-invalid'}`}>
          <span className="dag-status-icon">{isDAG ? '🌳' : '♻️'}</span>
          <div className="dag-status-text">
            <div className="dag-title">
              {isDAG ? 'Valid Directed Acyclic Graph' : 'Cycle Detected'}
            </div>
            <div className="dag-desc">
              {isDAG
                ? 'Pipeline has no cycles — ready to execute!'
                : 'Pipeline contains a cycle — execution order cannot be determined.'}
            </div>
          </div>
        </div>

        {/* Close */}
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      alert('Add at least one node to the pipeline before submitting.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pipeline = JSON.stringify({ nodes, edges });
      const formData = new FormData();
      formData.append('pipeline', pipeline);

      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${BACKEND_URL}/pipelines/parse`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
      alert(`❌ Error: ${err.message}\n\nMake sure the backend is running:\ncd backend && uvicorn main:app --reload`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="submit-area">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)', borderRadius: '100px', padding: '8px 12px 8px 16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} edge{edges.length !== 1 ? 's' : ''}
          </span>
          <button
            id="submit-pipeline-btn"
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                Analyzing…
              </>
            ) : (
              <>
                ⚡ Run Pipeline
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <ResultModal
          result={result}
          onClose={() => setResult(null)}
        />
      )}
    </>
  );
};
