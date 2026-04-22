import { useWorkflowStore } from "../../store/workflow.store";

const WorkflowPanel = () => {
  const { selectedNode, updateNodeData } = useWorkflowStore();

  if (!selectedNode) {
    return (
      <div className="w-80 border-l bg-white p-6 flex items-center justify-center text-slate-400 italic text-sm">
        Select a node to configure
      </div>
    );
  }

  // Cast to any to bypass strict data checking for the label
  const nodeData = selectedNode.data as any;

  return (
    <div className="w-80 border-l bg-white flex flex-col shadow-xl">
      <div className="p-6 border-b bg-slate-50">
        <h3 className="font-bold text-slate-800">Node Settings</h3>
        <p className="text-xs text-slate-500">ID: {selectedNode.id}</p>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Label</label>
          <input 
            type="text"
            className="w-full p-2 border rounded-md text-sm outline-indigo-500"
            value={nodeData.label || ""}
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowPanel;