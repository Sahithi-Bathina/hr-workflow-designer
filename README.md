# 🚀 NexusFlow: Advanced HR Workflow Designer

NexusFlow is a high-performance, interactive workflow builder designed for rapid HR process automation.
It enables users to **design, simulate, and export complex workflows visually in real-time**, with a strong focus on scalability and clean React architecture.

---

## 🌐 Live Demo

👉 https://hr-workflow-designer-o9wa.vercel.app/

---

## 🛠️ Tech Stack & Architecture

* **Framework:** React 18 + Vite
  *(Fast development experience with instant HMR and optimized builds)*

* **Canvas Engine:** React Flow (`@xyflow/react`)
  *(Custom node rendering, edge connections, and graph handling)*

* **State Management:** Zustand
  *(Lightweight, scalable global state without boilerplate)*

* **Styling:** Tailwind CSS
  *(Responsive, clean, and modern UI design)*

* **Logic Abstraction:** Custom Hooks
  *(Separation of business logic from UI components)*

---

## ✨ Key Features

### 🔹 Visual Workflow Builder

* Drag-and-drop interface for building workflows
* Multiple node types:

  * Start
  * Task
  * Approval
  * Automation
  * End

### 🔹 Custom React Flow Canvas

* Fully controlled canvas with Zustand
* Custom node components with dynamic styling
* Smooth edge connections for clarity

### 🔹 Dynamic Configuration Panel

* Context-aware sidebar for node configuration
* Real-time updates to node data
* Clean UX (no internal IDs exposed)

### 🔹 Workflow Simulation Engine

* Step-by-step execution of workflow
* Visual feedback on active nodes
* Live **System Console logs** for execution tracking

### 🔹 JSON Export / Import (Mock Persistence)

* Export complete workflow configuration
* Simulates backend persistence
* Enables workflow sharing and reuse

---

## 📐 Design Decisions

### 🧩 Feature-Based Architecture

Project is structured by features (e.g., `features/workflow`)
→ Improves scalability and maintainability

### 🔌 Decoupled Logic

Business logic (simulation, file handling, validation) is separated using custom hooks
→ UI components remain clean and focused

### 🎯 UX-First Design

* Removed internal IDs from UI
* Focused on user-friendly labels and descriptions
* Clean, production-style interface

### ⚡ Zustand for Global State

* Centralized store for Canvas + Sidebar + Simulation
* Avoids prop drilling
* Minimizes unnecessary re-renders

---

## 📝 Assumptions

* A valid workflow must contain **exactly one Start node**
* Workflow execution begins from the Start node
* Data persistence is handled via JSON export (no backend)
* Standard edge types are used for clarity

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sahithi-Bathina/hr-workflow-designer.git
cd hr-workflow-designer
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

### 4️⃣ Build for Production

```bash
npm run build
```

---

## 📊 Summary

NexusFlow demonstrates:

* Scalable frontend architecture
* Real-time workflow visualization
* Clean state management using Zustand
* Interactive UI with meaningful UX
* Strong separation of concerns

---

## 🔮 Future Improvements

* Backend integration (database + APIs)
* Workflow validation rules
* Multi-user collaboration
* Role-based access control
* Advanced branching logic

---

## 👨‍💻 Author

**Sahithi Bathina**
GitHub: https://github.com/Sahithi-Bathina

Developed as part of an **HR Workflow Designer Case Study**.

---

## ⭐ Final Note

This project focuses on **real-world system design and clean architecture**,
not just UI — making it closer to production-level applications.
