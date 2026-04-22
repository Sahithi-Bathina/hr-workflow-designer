export type NodeType = 'Start' | 'Task' | 'Approval' | 'Automation' | 'End';

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface NodeData {
  label: string;
  type: NodeType;
  description?: string;
  assignee?: string;
  dueDate?: string;
  approverRole?: string;
  threshold?: number;
  automationActionId?: string;
  actionParams?: Record<string, string>;
  metadata?: Record<string, string>;
  isProcessing?: boolean;
}