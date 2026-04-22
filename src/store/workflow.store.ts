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
} from "@xyflow/react";

type WorkflowState = {
  nodes: Node[];
  edges: Edge[];
  
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [
    {
      id: "start-1",
      type: "input", // Using 'input' for now as the 'Start Node' [cite: 67]
      position: { x: 250, y: 150 },
      data: { label: "Start Node" },
    },
  ],
  edges: [],

  onNodesChange: (changes) =>
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    }),

  onEdgesChange: (changes) =>
    set({
      edges: applyEdgeChanges(changes, get().edges),
    }),

  onConnect: (connection) =>
    set({
      edges: addEdge(connection, get().edges),
    }),
}));