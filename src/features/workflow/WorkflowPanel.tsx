import { useWorkflowStore } from "../../store/workflow.store";

const WorkflowPanel = () => {
  const { selectedNode, updateNodeData, deleteNode } = useWorkflowStore();

  const exportWorkflow = () => {
    const { nodes, edges } = useWorkflowStore.getState();
    const workflowData = {
      name: "HR_Onboarding_Flow",
      version: "1.0",
      timestamp: new Date().toISOString(),
      structure: { nodes, edges }
    };
    console.log("EXPORTED DATA:", workflowData);
    alert("Check Console for JSON export!");
  };

  if (!selectedNode) {
    return (
      <div className="w-80 border-l bg-white p-8 flex flex-col items-center justify-center text-slate-400 italic text-sm text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>
        </div>
        Select a node to configure settings.
      </div>
    );
  }

  const nodeData = selectedNode.data as any;

  return (
    <div className="w-80 border-l bg-white flex flex-col shadow-xl z-10">
      <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800">Node Properties</h3>
          <p className="text-[10px] font-mono text-slate-400">{selectedNode.id}</p>
        </div>
        <button 
          onClick={() => deleteNode(selectedNode.id)}
          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          title="Delete Node"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
      
      <div className="p-6 space-y-6 flex-1">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Display Label</label>
          <input 
            type="text"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={nodeData.label || ""}
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
          <textarea 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm h-24 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={nodeData.description || ""}
            onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
          />
        </div>
      </div>

      <div className="p-4 border-t bg-slate-50">
        <button 
          onClick={exportWorkflow}
          className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all shadow-sm"
        >
          Export Configuration
        </button>
      </div>
    </div>
  );
};

export default WorkflowPanel;