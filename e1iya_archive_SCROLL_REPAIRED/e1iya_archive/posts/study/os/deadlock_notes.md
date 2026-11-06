---
id: REC.001
title: Understanding Deadlocks
date: 2026-11-05
category: study/os
tags: [OS, Study]
featured: true
summary: Deadlock, resource allocation, and safety algorithm research notes.
---
# Understanding Deadlocks

> NOTE / 001 — Example research entry. Replace this content with your own notes.

## Deadlock conditions

Deadlock is a situation where processes cannot proceed because each is waiting for resources held by others.

- Mutual exclusion
- Hold and wait
- No preemption
- Circular wait

## Safety Algorithm

`work` represents resources currently available to finish processes. When a process completes, its allocation returns to the available pool.

```c
// Illustrative pseudocode
if (need[i] <= work) {
    work = work + allocation[i];
    finish[i] = true;
}
```

## Observation

A safe state means at least one safe sequence exists. It does not mean every scheduling order will be safe.
