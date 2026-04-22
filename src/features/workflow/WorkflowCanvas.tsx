import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import { useWorkflowStore } from "../../store/workflow.store";
import { useCallback } from "react";
import ActionNode from "../../components/nodes/ActionNode"; 
import "@xyflow/react/dist/style.css";

// Registers our custom design
const nodeTypes = {
  custom: ActionNode,
};

const WorkflowCanvas = () => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    addNode, 
    setSelectedNode,
    isSimulating 
  } = useWorkflowStore();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    const label = event.dataTransfer.getData('application/label');

    // Adjusting position to drop at cursor
    const position = { x: event.clientX - 450, y: event.clientY - 150 };
    
    const icons: Record<string, string> = { 
      Start: '🚀', 
      End: '🏁', 
      Approval: '⚖️', 
      Automation: '🤖', 
      Task: '📋' 
    };

    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom', 
      position,
      data: { 
        label: `New ${label}`, 
        type: label, 
        description: 'Click to add details...', 
        icon: icons[label] || '📋',
        isProcessing: false 
      },
    };

    addNode(newNode);
  }, [addNode]);

  return (
    <div className="w-full h-full relative bg-slate-50" onDrop={onDrop} onDragOver={onDragOver}>
      
      {/* 1. EMPTY STATE UI */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-xl p-14 rounded-[40px] border-2 border-dashed border-slate-200 text-center shadow-2xl shadow-indigo-100/50 scale-110">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg rotate-3">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Design Your Flow</h3>
            <p className="text-slate-500 text-sm max-w-[240px] mx-auto mt-3 leading-relaxed">
              Drag components from the sidebar to visualize your HR process.
            </p>
          </div>
        </div>
      )}

      {/* 2. SIMULATION HUD */}
      {isSimulating && (
        <>
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              LIVE SIMULATION ACTIVE
            </div>
          </div>

          <div className="absolute bottom-10 left-10 w-72 bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/10 z-50">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">System Console</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
              </div>
            </div>
            <div className="space-y-2 font-mono text-[11px]">
              {nodes.filter(n => n.data.isProcessing).map(n => (
                <div key={n.id} className="text-emerald-400 flex items-start gap-2">
                  <span className="text-white opacity-50">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                  <span>{`> RUNNING: ${n.data.label}...`}</span>
                </div>
              ))}
              {!nodes.some(n => n.data.isProcessing) && (
                <div className="text-slate-500 italic animate-pulse">{`> Awaiting next transition...`}</div>
              )}
            </div>
          </div>
        </>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node)}
        onPaneClick={() => setSelectedNode(null)}
        fitView
        snapToGrid={true}
        snapGrid={[20, 20]}
        minZoom={0.2}
      >
        <Background color="#cbd5e1" gap={25} variant="dots" />
        <Controls className="!bg-white !shadow-xl !border-none !rounded-2xl !overflow-hidden" />
        <MiniMap 
          nodeStrokeWidth={3} 
          maskColor="rgba(241, 245, 249, 0.7)" 
          className="!rounded-3xl !bg-white !shadow-2xl !border-slate-100"
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;