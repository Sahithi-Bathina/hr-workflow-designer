import { ReactFlowProvider } from "@xyflow/react";
import WorkflowCanvas from "../features/workflow/WorkflowCanvas";

function App() {
  return (
    /* This flex container ensures the app takes 100% of the viewport height */
    <div className="flex flex-col h-screen w-screen bg-white text-slate-900 overflow-hidden">
      <header className="px-6 py-4 border-b flex justify-between items-center bg-white z-10">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-indigo-600">NexusFlow</h1>
          <p className="text-xs text-slate-500">HR Workflow Designer | Case Study</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
            Simulate Workflow
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 bg-slate-100 relative">
        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>
      </main>
    </div>
  );
}

export default App;