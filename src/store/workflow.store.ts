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

type WorkflowState = {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  isSimulating: boolean;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNode: (node: Node | null) => void;
  addNode: (node: Node) => void;
  updateNodeData: (nodeId: string, newData: any) => void;
  runSimulation: () => Promise<void>;
  // ELITE FEATURES
  deleteNode: (nodeId: string) => void;
  clearCanvas: () => void;
  validateWorkflow: () => { isValid: boolean; errors: string[] };
};

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      nodes: [
        { 
          id: "start-1", 
          type: "input", 
          position: { x: 250, y: 150 }, 
          data: { label: "Start Node", description: "Beginning of process" } 
        },
      ],
      edges: [],
      selectedNode: null,
      isSimulating: false,

      onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
      onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
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
          set({ nodes: [], edges: [], selectedNode: null });
        }
      },

      validateWorkflow: () => {
        const { nodes, edges } = get();
        const errors: string[] = [];
        if (!nodes.find(n => n.type === 'input')) errors.push("Missing a 'Start' node.");
        if (nodes.length > 1) {
          const connectedIds = new Set(edges.flatMap(e => [e.source, e.target]));
          const orphans = nodes.filter(n => !connectedIds.has(n.id));
          if (orphans.length > 0) errors.push(`${orphans.length} nodes are disconnected.`);
        }
        return { isValid: errors.length === 0, errors };
      },

      runSimulation: async () => {
        const { validateWorkflow } = get();
        const validation = validateWorkflow();
        
        if (!validation.isValid) {
          alert(`Cannot simulate: \n- ${validation.errors.join('\n- ')}`);
          return;
        }

        const { nodes, edges } = get();
        set({ isSimulating: true });
        let currentId: string | undefined = nodes.find((n) => n.type === "input")?.id;

        while (currentId) {
          const nodeId = currentId;
          set({ nodes: get().nodes.map((n) => ({ ...n, selected: n.id === nodeId })) });
          await new Promise((r) => setTimeout(r, 1000));
          const nextEdge = edges.find((e) => e.source === nodeId);
          currentId = nextEdge?.target;
          if (!currentId) break;
        }

        set({ isSimulating: false });
        alert("Workflow Simulation Complete!");
      },
    }),
    { name: "nexus-flow-storage" }
  )
);