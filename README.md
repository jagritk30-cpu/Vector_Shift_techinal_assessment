# VectorShift Pipeline Builder 🚀

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge&logo=redux&logoColor=white)

**Live Demo:** [https://vector-shift-techinal-assessment.vercel.app](https://vector-shift-techinal-assessment.vercel.app)

A visual, drag-and-drop AI pipeline builder. This project allows users to construct complex workflows by connecting various nodes (I/O, LLMs, APIs, etc.) and validates that the resulting architecture is a valid Directed Acyclic Graph (DAG) before execution.

---

## 🛠️ Tech Stack

### Frontend
* **React 18**: Component-based architecture.
* **ReactFlow**: Industry-standard graph engine for node-based UIs, handling zooming, panning, and edge connections.
* **Zustand**: Lightweight, boilerplate-free state management (used for managing nodes, edges, and undo/redo history).
* **Vanilla CSS (Glassmorphism)**: Fully custom design system utilizing CSS variables for a premium, dark glassmorphism aesthetic. No heavy UI frameworks.

### Backend
* **FastAPI (Python)**: High-performance async framework for the API.
* **Kahn's Algorithm**: Implemented a BFS topological sort to detect cycles and validate that the submitted pipeline is a DAG.

---

## ✨ Core Features (Assignment Requirements)

1. **Node Abstraction**: Refactored the architecture so all nodes extend a reusable `<BaseNode>` component, ensuring DRY principles.
2. **5 New Node Types**: Added `Note` (annotations), `Math` (arithmetic), `API` (HTTP requests), `Filter` (conditional routing), and `Merge` (combining inputs).
3. **Dynamic Text Node (Showstopper)**: A text template node that uses real-time regex parsing to detect `{{variables}}` as the user types, dynamically generating and evenly spacing connection handles for each variable.
4. **DAG Validation**: The frontend serializes the graph and submits it to the FastAPI backend, which runs cycle detection and returns the graph's validity, node count, and edge count in a polished modal.

---

## 🚀 Standout Additions (Beyond Requirements)

To make this project truly production-ready, I built several extra features:

* **⌘K Spotlight Command Palette**: Fuzzy-search to instantly find and add nodes to the canvas center.
* **↩↪ Full Undo / Redo**: Implemented a 60-step snapshot-based history system in Zustand.
* **💾 Auto-Save & Persistence**: Debounced auto-saving to `localStorage` ensures work is never lost on refresh.
* **🖱️ Context Menus**: Custom right-click menus for both individual nodes (duplicate/delete) and the empty canvas.
* **⌨️ Keyboard Shortcuts**: Cross-platform global shortcuts (e.g., `?` for help, `⌘S` for save, `⌘E` for export).
* **📤 Export / Import JSON**: Serialize pipelines to downloadable JSON files, and import them back into the canvas using the browser's Blob/FileReader APIs.
* **🍞 Toast Notifications**: Micro-interactions providing immediate feedback for user actions.

---

## 💻 Running Locally

### 1. Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### 2. Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
```

*Note: For local execution, ensure both the frontend and backend servers are running simultaneously.*
