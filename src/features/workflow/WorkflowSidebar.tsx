import React from 'react';

const nodeTypes = [
  { type: 'input', label: 'Start', desc: 'Trigger the process', color: 'bg-blue-500' },
  { type: 'default', label: 'Task', desc: 'Human action required', color: 'bg-amber-500' },
  { type: 'default', label: 'Approval', desc: 'Manager sign-off', color: 'bg-purple-500' },
  { type: 'default', label: 'Automation', desc: 'System event', color: 'bg-emerald-500' },
  { type: 'output', label: 'End', desc: 'Process complete', color: 'bg-slate-900' },
];

const WorkflowSidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-72 border-r bg-white p-6 flex flex-col gap-6 shadow-sm h-full">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Components</h2>
        <p className="text-xs text-slate-400 font-medium">Drag items onto the canvas</p>
      </div>
      <div className="space-y-3">
        {nodeTypes.map((node) => (
          <div
            key={node.label}
            className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm cursor-grab active:scale-95 transition-all hover:border-indigo-200 hover:shadow-md flex items-center gap-4"
            onDragStart={(event) => onDragStart(event, node.type, node.label)}
            draggable
          >
            <div className={`w-2 h-10 rounded-full ${node.color}`} />
            <div>
              <div className="text-sm font-bold text-slate-700">{node.label}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-tight">{node.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default WorkflowSidebar;