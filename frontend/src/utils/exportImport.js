// utils/exportImport.js — Export pipeline to JSON file, import from JSON file

/**
 * Export nodes + edges as a downloadable .json file.
 */
export const exportPipeline = (nodes, edges, filename = 'pipeline') => {
  const payload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    appName: 'VectorShift Pipeline Builder',
    nodes,
    edges,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename}_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

/**
 * Parse a File object and extract the pipeline's nodes + edges.
 * Returns a Promise resolving to { nodes, edges }.
 */
export const importPipeline = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || file.type !== 'application/json') {
      reject(new Error('Please select a valid .json file'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
          throw new Error('Invalid pipeline format — missing nodes or edges array');
        }
        resolve({ nodes: data.nodes, edges: data.edges });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Trigger a file picker for importing a JSON pipeline file.
 * Returns a Promise resolving to { nodes, edges }.
 */
export const importPipelineViaFilePicker = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      importPipeline(file).then(resolve).catch(reject);
    };
    input.click();
  });
};
