import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  Node,
  OnEdgesChange,
  OnNodesChange,
  NodeChange, // Add this
  EdgeChange, // Add this
} from "@xyflow/react";

type WorkflowState = {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNode: (node: Node | null) => void;
  addNode: (node: Node) => void;
  updateNodeData: (nodeId: string, newData: any) => void;
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [
    { id: "start-1", type: "input", position: { x: 250, y: 150 }, data: { label: "Start Node" } },
  ],
  edges: [],
  selectedNode: null,

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
}));