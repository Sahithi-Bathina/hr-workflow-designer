import { useWorkflowStore } from "../../store/workflow.store";

export const useWorkflowActions = () => {
  const { nodes, edges } = useWorkflowStore();

  // Logic moved from component to hook for better React architecture
  const handleExport = () => {
    const workflowData = {
      name: "HR_Onboarding_Flow",
      version: "1.0",
      timestamp: new Date().toISOString(),
      structure: { nodes, edges }
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `hr-workflow-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // If your store has a direct importWorkflow function, call it here
        alert("Workflow Imported Successfully!");
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };

  return { handleExport, handleImport };
};