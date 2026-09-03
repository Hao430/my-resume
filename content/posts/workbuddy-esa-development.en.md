---
title: Shipping a Personal Site with WorkBuddy and Aliyun ESA
description: The whole build log of this site: Vue 3 + Vite on the front, edge static hosting, no server to maintain, push to deploy.
date: 2026-02-20
tags: [Frontend, Edge Computing, Case Study]
lang: both
draft: false
---

This post records how I built and deployed this personal site using WorkBuddy for AI-assisted development and Aliyun Edge Security Acceleration (ESA) for hosting.

## Requirements

The constraints I set before writing any code:

- fully static — no server to patch, no database to back up
- real SPA routing (Vue Router history mode) with working deep links
- automatic HTTPS
- usable from outside mainland China

ESA Pages matched all four, so the whole project reduces to "produce a `dist/` folder and push".

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Vue 3 + TypeScript | type safety, mature ecosystem |
| Build | Vite | fast HMR, fast production build |
| Hosting | Aliyun ESA Pages | global CDN, SPA fallback, GitHub-triggered builds |
| AI assistance | WorkBuddy | project context awareness, code generation |

## The build

**1. Scaffold.** Vite's Vue + TypeScript template. Two minutes to a running app.

**2. Components.** `<script setup>` throughout, Pinia for state, Vue Router for pages. Because there is no backend, "data" means Markdown files compiled at build time — the store never issues a request.

**3. Deploy config.** The interesting part is two lines:

```json
{
  "assets": {
    "directory": "./dist",
    "notFoundStrategy": "singlePageApplication"
  }
}
```

`singlePageApplication` is what makes `/blog/some-post` work on refresh: unknown paths return `index.html` and the router takes over.

**4. CI/CD.** GitHub Actions runs lint, type-check and build on every push; ESA watches the same repository, so pushing `main` is the deployment step. One consequence worth knowing: the platform serves `index.html` with HTTP 200 for *any* unknown path, so a leftover call to a deleted `/api` endpoint never 404s — it fails quietly when JSON parsing hits HTML. Silent breakage, which is why the checks are enforced before commit.

## What I learned

- Static hosting is the cheapest possible architecture: zero operations, near-zero cost, high availability, and the whole site survives as a git history.
- AI-assisted development is genuinely faster, but only with clear context — conventions written down in the repo beat instructions repeated in chat.
- Edge platforms make "global + fast" a config flag rather than an architecture project. For a one-person site that is the whole point.
