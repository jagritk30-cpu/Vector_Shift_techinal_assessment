// draggableNode.js — Premium node chip for the floating toolbar

export const DraggableNode = ({ type, label, icon }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`draggable-node ${type}`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
      title={`Drag to add ${label} node`}
    >
      <span className="node-icon">{icon}</span>
      <span className="node-chip-label">{label}</span>
    </div>
  );
};