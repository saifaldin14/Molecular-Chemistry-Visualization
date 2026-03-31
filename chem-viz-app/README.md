# ChemViz - Collaborative Chemistry Visualization

A real-time collaborative web application for writing chemistry formulas and visualizing molecular structures in 3D.

## Features

- **Real-Time Collaboration** — Multiple users can simultaneously edit chemistry documents using conflict-free replicated data types (CRDTs) powered by Yjs.
- **3D Molecule Visualization** — Interactive three-dimensional rendering of molecular structures with rotation, zoom, and pan controls.
- **Formula Parsing** — Automatic parsing of chemical formulas with subscript/superscript rendering and molecular weight calculation.
- **Periodic Table** — Built-in interactive periodic table for quick element lookup and insertion.
- **Document Management** — Create, save, and organize chemistry documents with persistent storage.

## Architecture

```
┌─────────────┐        WebSocket / Socket.IO        ┌──────────────┐
│   React     │ <──────────────────────────────────> │  Node.js     │
│   Frontend  │         Yjs CRDT Sync                │  Backend     │
│  (Vite)     │                                      │  (Express)   │
└─────────────┘                                      └──────────────┘
```

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | React, TypeScript, Vite, Three.js |
| Backend  | Node.js, Express, TypeScript      |
| Realtime | Socket.IO, Yjs CRDT               |
| 3D       | Three.js / React Three Fiber      |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd chem-viz-app

# Install root dependencies
npm install

# Install client and server dependencies
npm run install:all
```

### Development

Start both the client and server in development mode:

```bash
npm run dev
```

Or run them individually:

```bash
npm run dev:server   # Start the backend server
npm run dev:client   # Start the frontend dev server
```

### Production Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Usage

1. Open the application in your browser (default: `http://localhost:5173`).
2. Create a new chemistry document or open an existing one.
3. Type chemical formulas — they are automatically parsed and rendered with proper subscripts and superscripts.
4. Click a formula to visualize its 3D molecular structure.
5. Share the document URL with collaborators to edit in real time.

## Tech Stack

- **React** — UI component library
- **TypeScript** — Static typing for both client and server
- **Vite** — Fast frontend build tool and dev server
- **Express** — Backend HTTP framework
- **Socket.IO** — Bidirectional real-time communication
- **Yjs** — CRDT framework for conflict-free collaborative editing
- **Three.js / React Three Fiber** — 3D molecular rendering

## Project Structure

```
chem-viz-app/
├── package.json          # Root monorepo configuration
├── README.md             # Project documentation
├── .gitignore
├── client/               # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API and WebSocket services
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── server/               # Node.js backend application
    ├── src/
    │   ├── routes/       # Express route handlers
    │   ├── services/     # Business logic
    │   ├── types/        # TypeScript type definitions
    │   └── index.ts      # Server entry point
    ├── package.json
    └── tsconfig.json
```

## License

This project is part of a university coursework on molecular chemistry visualization.
