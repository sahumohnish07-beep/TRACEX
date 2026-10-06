# TRACE-X — Criminal Network Analysis & Investigation Platform (Local Authority Interface)

Desktop-first frontend for TRACE-X, purpose-built for the **Local Authority / Police Station Level** operational tier, featuring a public animated entry flow, authority level selection, and complete authenticated station workflows.

---

## 1. Tech Stack
- **Framework**: React 18 + TypeScript (strict mode, zero `any`)
- **Build Tool**: Vite
- **Graph Engine**: Cytoscape.js (`cytoscape-fcose` layout engine) encapsulated within a typed React `useRef` + `useEffect` wrapper (`CytoscapeGraph.tsx`). Used for both the interactive investigation network and the animated background landing network.
- **Routing**: `react-router-dom`
- **Iconography**: `lucide-react` (simple, outlined, always paired with descriptive text labels — except on the landing page, which is icon-free by design)
- **Styling**: Pure CSS + CSS Custom Properties (`tokens.css` & `global.css`). No Tailwind, no UI kit, no glassmorphism or external motion dependencies.
- **Data**: 100% typed local mock repositories in `/src/data`.

---

## 2. Running Locally

### Development Server
```bash
npm install
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### Production Build
```bash
npm run build
```
Runs `tsc -b && vite build` with zero TypeScript errors.

---

## 3. Full Route Map

```
/
├── /                             Landing Page (Animated Cytoscape drift network, custom reticle cursor, clickable "X")
├── /login                        Authority Selection (Local, State, Central tier cards)
│   ├── /login/state              State Authority Stub ("Not available in this build")
│   └── /login/central            Central Authority Stub ("Not available in this build")
│
└── [Authenticated AppShell — Protected Routes]
    ├── /dashboard                Investigation Dashboard (4 metric stat cards, requires attention list, recent cases)
    ├── /cases                    Station Cases Registry (Spacious table, multi-field search, status/priority filters)
    ├── /cases/new                Create New Case (5-step stepper: Details → Upload → Extract → Review → Register)
    ├── /cases/:id                Case Workspace Dossier (Summary, metadata banner, persons, evidence, tabs)
    ├── /cases/:id/network        Network Analysis (Cytoscape graph, fcose layout, zoom/search toolbar, inspect SidePanel, accessible List View toggle)
    ├── /cases/:id/missing-links  Missing Link Analysis (One candidate at a time, evidence basis list, strength badges, confirm/dismiss)
    ├── /persons/:id              Person Profile Dossier (Contact vectors, risk level, associated cases, verified records)
    ├── /requests                 Inter-Agency Data Requests (Outgoing requisition status ledger)
    ├── /requests/new             Request Investigation Data (5-step requisition stepper with legal justification)
    ├── /incoming/:id             Incoming Data Request (Adjudication, restricted data filtering, selective disclosure)
    ├── /incoming/:id/review      Review Data Before Sending (Certification box, cryptographic transmission modal)
    ├── /received                 Received External Intelligence (Controlled isolation notice, import to view)
    ├── /views/:id                My Investigation View (Private working copy sandbox graph, node hide/expand/focus)
    └── /audit                    Station Statutory Audit Log (Immutable, cryptographically chained activity ledger)
```

---

## 4. Key Design System Tokens & Rules
- **Color Theme**:
  - `--bg-page`: `#F4F6F9`
  - `--bg-surface`: `#FFFFFF`
  - `--primary`: `#1F2A6B` (deep navy)
  - `--accent`: `#2F5FD0` (restrained blue)
  - `--text`: `#1E2430`
  - `--text-muted`: `#5A6475`
  - Status tokens: Success (`#1E7B4F`), Warning (`#A35B00`), Danger (`#B42318`), Neutral (`#5A6475`). Always paired with icon + text.
- **Typography & Scale**:
  - Strictly **no text below 14px** across the entire application.
  - Page titles: 28px/600, section titles: 20px/600, card numbers: 32px/600.
  - Table rows minimum 56px height.
- **Source Verification Badges**:
  - Every intelligence fact displays its lineage: `VERIFIED RECORD`, `SYSTEM-DERIVED`, or `AI ANALYSIS`.
  - AI analysis displays its inspectable evidence basis and is never presented as uncorroborated fact.
- **Accessibility**:
  - WCAG AA contrast compliance verified across all states.
  - Prominent 3px accent focus ring with 2px offset on all interactive elements.
  - Modal focus trapping, Esc key dismissal, and semantic ARIA landmark regions.
  - Respects `prefers-reduced-motion: reduce` by freezing animations and showing static layouts.
