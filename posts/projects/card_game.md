---
id: REC.003
title: Java Card Game
date: 2026-10-29
category: projects
tags: [Java, Project]
featured: false
summary: A small object-oriented card comparison game.
---
# Java Card Game

## Structure

The example uses `Card`, `CardDeck`, `Player`, and `CardGame` classes.

## Deck

A standard 52-card deck is shuffled and drawn without replacement.

```java
for (int i = cards.length - 1; i > 0; i--) {
    int j = random.nextInt(i + 1);
    Card tmp = cards[i];
    cards[i] = cards[j];
    cards[j] = tmp;
}
```

## Observation

The card comparison rule should be separated from game flow.
