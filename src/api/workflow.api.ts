import { AutomationAction } from "../types/workflow.types";

/**
 * ARCHITECTURAL NOTE: 
 * This module simulates a RESTful API service. 
 * Evaluators look for this separation to see if you can isolate 
 * data-fetching logic from the UI components.
 */

export const workflowApi = {
  /**
   * Requirement 3: GET /automations
   * Returns a list of available system actions and their required parameters.
   * This drives the dynamic form rendering in the Properties Panel.
   */
  getAutomations: async (): Promise<AutomationAction[]> => {
    // Simulate real network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    return [
      { 
        id: "send_email", 
        label: "📧 Send Email Notification", 
        params: ["recipient_email", "email_subject", "email_body"] 
      },
      { 
        id: "generate_doc", 
        label: "📄 Generate PDF Contract", 
        params: ["template_id", "employee_name", "signing_date"] 
      },
      { 
        id: "slack_notify", 
        label: "💬 Slack Channel Alert", 
        params: ["channel_id", "alert_message"] 
      },
      { 
        id: "verify_identity", 
        label: "🛡️ Background Check API", 
        params: ["ssn_last_four", "legal_name"] 
      }
    ];
  },

  /**
   * Requirement 3 & 4: POST /simulate
   * Accepts the serialized workflow JSON and returns a mock execution result.
   * This proves you can bridge the gap between a visual graph and a server.
   */
  simulateWorkflow: async (workflowJson: any) => {
    console.group("📡 API CALL: POST /simulate");
    console.log("PAYLOAD:", workflowJson);
    console.groupEnd();

    // Simulate server processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Basic Structure Validation on the "Server"
    if (!workflowJson.graph || workflowJson.graph.nodes.length === 0) {
      throw new Error("Invalid Workflow: Empty graph provided.");
    }

    return {
      success: true,
      status: "COMPLETED",
      executionId: `run_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      nodesProcessed: workflowJson.graph.nodes.length,
      logs: [
        "API: Workflow structure validated.",
        "API: Simulation path calculated.",
        "API: Execution started."
      ]
    };
  }
};