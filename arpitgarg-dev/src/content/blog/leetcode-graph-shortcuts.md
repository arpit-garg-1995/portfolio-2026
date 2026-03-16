---
title: "LeetCode Graph Tips I Actually Reuse"
description: "A short set of graph patterns that reduce interview panic and improve implementation speed."
pubDate: 2026-03-08
tags: ["LeetCode", "Graphs", "Swift"]
draft: false
---

I do better on graph problems when I identify the shape before I write code.

## My quick pattern map

- Shortest path with equal edge weights: BFS.
- Weighted shortest path with non-negative edges: Dijkstra.
- Connected groups: DFS, BFS, or Union-Find.
- Topological ordering: Kahn or DFS finishing order.

## Small habit that helps

Before writing the solution, I ask one boring question: what is the node, and what exactly creates an edge?

That single sentence usually removes half the confusion.
