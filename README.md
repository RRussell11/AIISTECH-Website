# ΛProof Website

This repository contains the marketing and information site for ΛProof, a proof-first personal computing stack focused on lawful, ethically constrained, and user-sovereign state transitions.

## Overview

The site highlights the core ideas behind ΛProof and the broader Web4 vision:

- **Proof-first computing:** every state transition must be provably lawful and accountable.
- **Ethical invariants:** systems are designed to respect privacy, agency, and transparent governance.
- **Developer pathways:** guidance for builders exploring the ΛProof paper and protocols.

Key sections include the hero narrative, the problem statement, protocol and guarantee overviews, a constitution for accountability, and calls-to-action for developers.

## Tech stack

- Vite
- React + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query

## Getting started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server with hot reloading:
   ```sh
   npm run dev
   ```
3. Build for production:
   ```sh
   npm run build
   ```
4. Preview the production build locally:
   ```sh
   npm run preview
   ```

## Project structure

- `src/pages/Index.tsx` – top-level page composition and routing.
- `src/components/` – UI sections such as the hero, problem statement, guarantees, protocols, and CTA.
- `public/` – static assets served as-is.

## Contributing

1. Create a new branch for your changes.
2. Ensure the development server runs without errors (`npm run dev`).
3. Commit your work with clear messages and open a pull request for review.
