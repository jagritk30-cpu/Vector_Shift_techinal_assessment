# main.py — VectorShift Pipeline Parser Backend
# Part 4: Parses pipeline JSON, counts nodes/edges, and checks if the graph is a DAG.

from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict, deque
import json

app = FastAPI(title="VectorShift Pipeline API", version="1.0.0")

# Allow requests from React dev server AND Vercel production deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # wildcard covers localhost + any Vercel/custom domain
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


def is_dag(num_nodes: int, edges: list[dict]) -> bool:
    """
    Kahn's Algorithm (BFS-based Topological Sort) to detect cycles.
    Returns True if the graph is a DAG (no cycles), False otherwise.
    """
    # Build adjacency list and in-degree map
    adj = defaultdict(set)
    in_degree = defaultdict(int)

    # Collect all unique node ids referenced by edges
    node_ids = set()
    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        if src is None or tgt is None:
            continue
        node_ids.add(src)
        node_ids.add(tgt)
        if tgt not in adj[src]:  # avoid duplicate edges
            adj[src].add(tgt)
            in_degree[tgt] += 1
            # Ensure source also has an entry
            if src not in in_degree:
                in_degree[src] = in_degree.get(src, 0)

    # Initialize queue with all nodes with in-degree 0
    queue = deque([n for n in node_ids if in_degree[n] == 0])
    visited_count = 0

    while queue:
        node = queue.popleft()
        visited_count += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If we processed all nodes, there's no cycle
    return visited_count == len(node_ids)


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: str = Form(...)):
    """
    Parses a pipeline JSON payload.

    Expected payload (as JSON string):
        {
          "nodes": [...],  // ReactFlow node objects
          "edges": [...]   // ReactFlow edge objects
        }

    Returns:
        {
          "num_nodes": int,
          "num_edges": int,
          "is_dag": bool
        }
    """
    try:
        data = json.loads(pipeline)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON payload"}

    nodes = data.get("nodes", [])
    edges = data.get("edges", [])

    num_nodes = len(nodes)
    num_edges = len(edges)
    graph_is_dag = is_dag(num_nodes, edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": graph_is_dag,
    }
