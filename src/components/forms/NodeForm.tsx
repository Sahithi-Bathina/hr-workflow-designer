import { useEffect, useState } from "react";
import { useWorkflowStore } from "../../store/workflow.store";
import { workflowApi } from "../../api/workflow.api";
import { AutomationAction } from "../../types/workflow.types";

export const NodeForm = () => {
  const { 
    selectedNode, 
    updateNodeData, 
    deleteNode, 
    exportWorkflow, 
    importWorkflow,
    validateWorkflow 
  } = useWorkflowStore();
  const [automations, setAutomations] = useState<AutomationAction[]>([]);

  useEffect(() => {
    workflowApi.getAutomations().then(setAutomations);
  }, []);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonString = event.target?.result as string;
      importWorkflow(jsonString);
      e.target.value = ''; // Reset for future imports
    };
    reader.readAsText(file);
  };

  const handleValidationCheck = () => {
    const { isValid, errors } = validateWorkflow();
    if (isValid) {
      alert("✅ Workflow is valid and ready for simulation!");
    } else {
      alert(`⚠️ Validation Errors:\n\n${errors.map(err => `- ${err}`).join('\n')}`);
    }
  };

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col p-6">
        <div className="flex-1 flex items-center justify-center text-slate-400 italic text-sm">
          Select a node to edit properties.
        </div>
        <div className="space-y-3 pt-6 border-t border-slate-100">
           <button 
            onClick={handleValidationCheck}
            className="w-full py-3 bg-amber-50 text-amber-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-amber-100 transition-all"
          >
            🔍 Validate Graph
          </button>
          <button 
            onClick={() => exportWorkflow()}
            className="w-full py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            💾 Export JSON
          </button>
          <label className="w-full py-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl font-bold text-indigo-600 text-center cursor-pointer hover:bg-indigo-100 transition-all shadow-sm block">
            📥 Import JSON
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>
      </div>
    );
  }

  const data = selectedNode.data;

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Edit {data.type} Node</h3>
          <button onClick={() => deleteNode(selectedNode.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg text-sm font-bold">Delete</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Display Label</label>
            <input 
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all" 
              value={data.label} 
              onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Description</label>
            <textarea 
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all min-h-[80px] text-sm" 
              value={data.description || ''} 
              onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })} 
              placeholder="What does this step do?"
            />
          </div>

          {data.type === 'Task' && (
            <>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Assignee</label>
                <input className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500" value={data.assignee || ''} onChange={(e) => updateNodeData(selectedNode.id, { assignee: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Due Date</label>
                <input type="date" className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500" value={data.dueDate || ''} onChange={(e) => updateNodeData(selectedNode.id, { dueDate: e.target.value })} />
              </div>
            </>
          )}

          {data.type === 'Automation' && (
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Choose Action</label>
              <select 
                className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                value={data.automationActionId || ''}
                onChange={(e) => updateNodeData(selectedNode.id, { automationActionId: e.target.value })}
              >
                <option value="">Select Action...</option>
                {automations.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </div>
          )}

          {data.type === 'Approval' && (
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Approver Role</label>
              <select className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500" value={data.approverRole || ''} onChange={(e) => updateNodeData(selectedNode.id, { approverRole: e.target.value })}>
                <option value="Manager">Manager</option>
                <option value="HRBP">HRBP</option>
                <option value="Director">Director</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-white space-y-3">
        <button 
          onClick={handleValidationCheck}
          className="w-full py-3 bg-amber-50 text-amber-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-amber-100 transition-all"
        >
          🔍 Validate Graph
        </button>
        <button 
          onClick={() => exportWorkflow()}
          className="w-full py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
        >
          💾 Export JSON
        </button>
        <label className="w-full py-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl font-bold text-indigo-600 text-center cursor-pointer hover:bg-indigo-100 transition-all shadow-sm block">
          📥 Import JSON
          <input type="file" accept=".json" className="hidden" onChange={handleImport} />
        </label>
      </div>
    </div>
  );
};