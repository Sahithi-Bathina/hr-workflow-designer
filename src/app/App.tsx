import { ReactFlowProvider } from "@xyflow/react";
import WorkflowCanvas from "../features/workflow/WorkflowCanvas";
import WorkflowSidebar from "../features/workflow/WorkflowSidebar";
import WorkflowPanel from "../features/workflow/WorkflowPanel";

function App() {
  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      {/* Navbar */}
      <header className="h-16 px-8 border-b flex justify-between items-center bg-white z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">N</div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            NexusFlow
          </h1>
        </div>
        <div className="flex gap-4">
           <button className="px-5 py-2 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100">
            Simulate Workflow
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <WorkflowSidebar />
        
        <main className="flex-1 relative p-4">
          <ReactFlowProvider>
            <WorkflowCanvas />
          </ReactFlowProvider>
        </main>

        <WorkflowPanel />
      </div>
    </div>
  );
}

export default App;