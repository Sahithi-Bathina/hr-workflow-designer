import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";
import { workflowApi } from "../api/workflow.api";

export interface SimulationLog {
  timestamp: string;
  nodeId: string;
  label: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

type WorkflowState = {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  isSimulating: boolean;
  simulationLogs: SimulationLog[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNode: (node: Node | null) => void;
  addNode: (node: Node) => void;
  updateNodeData: (nodeId: string, newData: any) => void;
  deleteNode: (nodeId: string) => void;
  clearCanvas: () => void;
  validateWorkflow: () => { isValid: boolean; errors: string[] };
  runSimulation: () => Promise<void>;
  
  // NEW: Requirement-Specific Methods
  serializeWorkflow: () => any;
  exportWorkflow: () => void;
  importWorkflow: (jsonString: string) => void;
};

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNode: null,
      isSimulating: false,
      simulationLogs: [],

      onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
      
      onConnect: (connection) => {
        const edge = { 
          ...connection, 
          id: `edge-${Date.now()}`, 
          animated: false, 
          style: { stroke: '#cbd5e1', strokeWidth: 2 } 
        };
        set({ edges: addEdge(edge, get().edges) });
      },

      setSelectedNode: (node) => set({ selectedNode: node }),
      addNode: (node) => set({ nodes: [...get().nodes, node] }),
      
      updateNodeData: (nodeId, newData) =>
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
          ),
          selectedNode: get().selectedNode?.id === nodeId 
            ? { ...get().selectedNode!, data: { ...get().selectedNode!.data, ...newData } }
            : get().selectedNode
        }),

      deleteNode: (nodeId) => {
        set({
          nodes: get().nodes.filter((n) => n.id !== nodeId),
          edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
          selectedNode: null,
        });
      },

      clearCanvas: () => {
        if (confirm("Clear all nodes and progress?")) {
          set({ nodes: [], edges: [], selectedNode: null, simulationLogs: [] });
        }
      },

      // REQUIREMENT 4: Serialize entire workflow graph
      serializeWorkflow: () => {
        const { nodes, edges } = get();
        return {
          version: "1.0.0",
          exportedAt: new Date().toISOString(),
          graph: {
            nodes: nodes.map(n => ({
              id: n.id,
              type: n.type, // Preserving the React Flow node type
              position: n.position,
              data: {
                label: n.data.label,
                type: n.data.type, // Your custom internal type (Start/Task etc)
                description: n.data.description,
                icon: n.data.icon,
                assignee: n.data.assignee,
                dueDate: n.data.dueDate,
                approverRole: n.data.approverRole,
                threshold: n.data.threshold,
                automationActionId: n.data.automationActionId,
                actionParams: n.data.actionParams,
                metadata: n.data.metadata,
                summaryFlag: n.data.summaryFlag,
                endMessage: n.data.endMessage
              }
            })),
            edges: edges.map(e => ({
              id: e.id,
              source: e.source,
              target: e.target,
              animated: e.animated,
              style: e.style
            }))
          }
        };
      },

      // BONUS: Export as physical JSON file for download
      exportWorkflow: () => {
        const data = get().serializeWorkflow();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `hr-workflow-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },

      // BONUS: Import from JSON string
      importWorkflow: (jsonString: string) => {
        try {
          const parsed = JSON.parse(jsonString);
          // Check if it follows your serialized structure
          const graphData = parsed.graph ? parsed.graph : parsed;
          
          if (graphData.nodes && graphData.edges) {
            set({ 
              nodes: graphData.nodes, 
              edges: graphData.edges,
              selectedNode: null 
            });
            return true;
          }
          throw new Error("Invalid structure");
        } catch (e) {
          alert("Invalid Workflow JSON file. Please ensure it is a valid export.");
          return false;
        }
      },

      validateWorkflow: () => {
        const { nodes, edges } = get();
        const errors: string[] = [];
        const hasStart = nodes.some(n => n.data.type === 'Start');
        const hasEnd = nodes.some(n => n.data.type === 'End');

        if (!hasStart) errors.push("Missing a 'Start' node.");
        if (!hasEnd) errors.push("Missing an 'End' node.");

        if (nodes.length > 1) {
          const connectedIds = new Set(edges.flatMap(e => [e.source, e.target]));
          const orphans = nodes.filter(n => !connectedIds.has(n.id));
          if (orphans.length > 0) {
            errors.push(`${orphans.length} node(s) are disconnected.`);
          }
        }
        return { isValid: errors.length === 0, errors };
      },

      runSimulation: async () => {
        const { validateWorkflow, nodes, edges, serializeWorkflow } = get();
        const validation = validateWorkflow();
        
        if (!validation.isValid) {
          alert(`Validation Failed: \n- ${validation.errors.join('\n- ')}`);
          return;
        }

        const payload = serializeWorkflow();
        set({ isSimulating: true, simulationLogs: [] });

        try {
          const apiResponse = await workflowApi.simulateWorkflow(payload);
          
          let currentId: string | undefined = nodes.find((n) => n.data.type === "Start")?.id;

          while (currentId) {
            const nodeId = currentId;
            const node = nodes.find(n => n.id === nodeId);
            
            const newLog: SimulationLog = {
              timestamp: new Date().toLocaleTimeString(),
              nodeId: nodeId,
              label: node?.data.label || 'Unknown',
              status: 'success',
              message: `Executed ${node?.data.type}: ${apiResponse.status}`
            };

            set((state) => ({
              simulationLogs: [...state.simulationLogs, newLog],
              nodes: state.nodes.map((n) => ({ 
                ...n, 
                data: { ...n.data, isProcessing: n.id === nodeId } 
              })),
              edges: state.edges.map((e) => ({ 
                ...e, 
                animated: e.source === nodeId,
                style: { 
                  stroke: e.source === nodeId ? '#6366f1' : '#cbd5e1', 
                  strokeWidth: e.source === nodeId ? 4 : 2 
                }
              }))
            }));

            await new Promise((r) => setTimeout(r, 1000));

            const nextEdge = edges.find((e) => e.source === nodeId);
            currentId = nextEdge?.target;
            if (!currentId) break;
          }
        } catch (err) {
          alert("Simulation API Error");
        } finally {
          set({ 
            isSimulating: false, 
            nodes: get().nodes.map(n => ({ ...n, data: { ...n.data, isProcessing: false } })),
            edges: get().edges.map(e => ({ ...e, animated: false, style: { stroke: '#cbd5e1', strokeWidth: 2 } })) 
          });
        }
      },
    }),
    { name: "nexus-flow-storage" }
  )
);