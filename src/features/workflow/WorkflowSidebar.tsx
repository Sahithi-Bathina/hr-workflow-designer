import React, { useEffect, useState } from 'react';
import { useWorkflowStore } from '../../store/workflow.store';
import { workflowApi } from '../../api/workflow.api';
import { AutomationAction } from '../../types/workflow.types';

const nodeTypes = [
  { type: 'Start', label: 'Start', desc: 'Trigger the process', color: 'bg-blue-500', icon: '🚀' },
  { type: 'Task', label: 'Task', desc: 'Human action required', color: 'bg-amber-500', icon: '📋' },
  { type: 'Approval', label: 'Approval', desc: 'Manager sign-off', color: 'bg-purple-500', icon: '⚖️' },
  { type: 'Automation', label: 'Automation', desc: 'System event', color: 'bg-emerald-500', icon: '🤖' },
  { type: 'End', label: 'End', desc: 'Process complete', color: 'bg-slate-900', icon: '🏁' },
];

const WorkflowSidebar = () => {
  const { selectedNode, updateNodeData, setSelectedNode } = useWorkflowStore();
  const [automations, setAutomations] = useState<AutomationAction[]>([]);

  useEffect(() => {
    // Requirement 3: Integrate Mock API for dynamic actions
    workflowApi.getAutomations().then(setAutomations);
  }, []);

  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  // If a node is selected, show the CONFIGURATION FORM (Requirement 2)
  if (selectedNode) {
    const { data } = selectedNode;
    
    return (
      <aside className="w-80 border-l bg-white flex flex-col h-full shadow-2xl z-50 animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b bg-slate-900 text-white flex justify-between items-center">
          <div>
            <div className="text-[10px] font-black uppercase opacity-50 tracking-widest">Configuring</div>
            <h2 className="text-lg font-bold">{data.type} Node</h2>
          </div>
          <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* COMMON FIELD: TITLE */}
          <section>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
            <input 
              className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={data.label || ''}
              onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            />
          </section>

          {/* DYNAMIC FORM LOGIC BASED ON NODE TYPE */}
          
          {data.type === 'Start' && (
            <section>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Metadata (Key-Value)</label>
              <textarea 
                placeholder="key1:value1, key2:value2"
                className="w-full p-3 bg-slate-50 border rounded-xl h-24 text-sm"
                value={data.metadata ? Object.entries(data.metadata).map(([k, v]) => `${k}:${v}`).join(', ') : ''}
                onChange={(e) => {
                  const obj = Object.fromEntries(e.target.value.split(',').map(s => s.split(':').map(i => i.trim())));
                  updateNodeData(selectedNode.id, { metadata: obj });
                }}
              />
            </section>
          )}

          {data.type === 'Task' && (
            <div className="space-y-4">
              <section>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                <textarea className="w-full p-3 bg-slate-50 border rounded-xl h-20 text-sm" value={data.description || ''} onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })} />
              </section>
              <section>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assignee</label>
                <input className="w-full p-3 bg-slate-50 border rounded-xl" value={data.assignee || ''} onChange={(e) => updateNodeData(selectedNode.id, { assignee: e.target.value })} />
              </section>
              <section>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Due Date</label>
                <input type="date" className="w-full p-3 bg-slate-50 border rounded-xl" value={data.dueDate || ''} onChange={(e) => updateNodeData(selectedNode.id, { dueDate: e.target.value })} />
              </section>
            </div>
          )}

          {data.type === 'Approval' && (
            <div className="space-y-4">
              <section>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Approver Role</label>
                <select className="w-full p-3 bg-slate-50 border rounded-xl" value={data.approverRole || 'Manager'} onChange={(e) => updateNodeData(selectedNode.id, { approverRole: e.target.value })}>
                  <option value="Manager">Manager</option>
                  <option value="HRBP">HRBP</option>
                  <option value="Director">Director</option>
                </select>
              </section>
              <section>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Threshold (%)</label>
                <input type="number" className="w-full p-3 bg-slate-50 border rounded-xl" value={data.threshold || 0} onChange={(e) => updateNodeData(selectedNode.id, { threshold: Number(e.target.value) })} />
              </section>
            </div>
          )}

          {data.type === 'Automation' && (
            <div className="space-y-4">
              <section>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Action from Mock API</label>
                <select className="w-full p-3 bg-slate-50 border rounded-xl" value={data.automationActionId || ''} onChange={(e) => updateNodeData(selectedNode.id, { automationActionId: e.target.value })}>
                  <option value="">Select Action...</option>
                  {automations.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                </select>
              </section>

              {/* DYNAMIC PARAMETERS: Requirement 2.4 */}
              {data.automationActionId && (
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-3">
                  <div className="text-[10px] font-black text-indigo-400 uppercase">Action Parameters</div>
                  {automations.find(a => a.id === data.automationActionId)?.params.map(param => (
                    <div key={param}>
                      <label className="block text-[10px] font-bold text-indigo-900 uppercase mb-1">{param}</label>
                      <input 
                        className="w-full p-2 bg-white border border-indigo-200 rounded-lg text-sm"
                        value={data.actionParams?.[param] || ''}
                        onChange={(e) => updateNodeData(selectedNode.id, { 
                          actionParams: { ...data.actionParams, [param]: e.target.value } 
                        })}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {data.type === 'End' && (
            <div className="space-y-4">
              <section>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Success Message</label>
                <input className="w-full p-3 bg-slate-50 border rounded-xl" value={data.endMessage || ''} onChange={(e) => updateNodeData(selectedNode.id, { endMessage: e.target.value })} />
              </section>
              <section className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
                 <label className="text-xs font-bold text-slate-500 uppercase">Tredence Summary Flag</label>
                 <input 
                    type="checkbox" 
                    checked={data.summaryFlag || false} 
                    onChange={(e) => updateNodeData(selectedNode.id, { summaryFlag: e.target.checked })}
                    className="w-5 h-5 accent-indigo-600"
                  />
              </section>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // If NO node is selected, show the COMPONENTS LIST (Original Drag-and-Drop)
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
            className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm cursor-grab active:scale-95 transition-all hover:border-indigo-200 hover:shadow-md flex items-center gap-4 group"
            onDragStart={(event) => onDragStart(event, node.type, node.label)}
            draggable
          >
            <div className={`w-10 h-10 rounded-xl ${node.color} flex items-center justify-center text-xl shadow-inner group-hover:rotate-6 transition-transform`}>
              {node.icon}
            </div>
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