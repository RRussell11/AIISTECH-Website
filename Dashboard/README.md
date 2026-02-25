# AIITech Client Dashboard (PSA + Automation Console)

Role-based client **command center** showing project, financial, and automation health in one place, integrated with AIITech’s PSA and automation platform [file:8].

---

## Overview

The AIITech Client Dashboard is a React/TypeScript web application that gives client stakeholders (Executive, Finance, Operations, IT) a real-time view of automation status, savings, exceptions, and PSA metrics in a single interface [file:8]. It is designed as the primary “Command Center” for monitoring value, risk, and performance of automations across a tenant.

### High-level goals

- Single-pane view of cost savings, automation rate, uptime, FTE hours freed, and compliance [file:8].
- Role-based variants (Exec/Ops/Finance/IT) using the same layout with different metrics and filters [file:8].
- Real-time or near-real-time view of automation status, exceptions, and PSA-linked financials [file:8].

---

## Architecture & Tech Stack

The dashboard is built as a SPA/CSR app, typically embedded behind SSO and talking to a BFF or API gateway.

### Frontend

- **Framework**: React + TypeScript [file:8].
- **Styling**: Tailwind CSS using the shared AIITech design tokens [file:8].
- **Charts**: Recharts for line and bar charts [file:8].
- **HTTP client**: Axios for REST API calls [file:8].
- **State / data fetching**: React Query (or SWR) for caching, retries, and refetching [file:8].
- **Routing**: React Router (or Next.js app router if this is a Next-based frontend shell).

### Backend Integration

All data is consumed via tenant-scoped dashboard APIs:

- Base path: `/api/dashboard/:tenantId` or `/tenants/:tenantId/dashboard` via a BFF [file:8].
- Optional WebSocket/SSE endpoint for live alerts and bot status updates: `/api/dashboard/:tenantId/stream` [file:8].

### Security & RBAC

- Access via signed JWT/opaque token with `tenantId`, `roles`, and `scopes` claims [file:8].
- Every dashboard request must include tenant context and is validated server-side [file:8].
- Role-based views are enforced both in backend and frontend (per-component guards) [file:8].

---

## Features

### Layout & Navigation

Desktop layout (~1200px wide) with:

- **Header** [file:8]:
  - Left: Logo, workspace selector, environment badge (Prod/Sandbox).
  - Center: Global date-range selector (Today / 7d / 30d / Custom).
  - Right: Role switcher (Exec/Ops/Finance/IT), notifications, user menu.
- **Side navigation** [file:8]:
  - Dashboard (default)
  - Automations
  - Processes
  - Projects & Billing
  - Compliance & Audit
  - Settings
- **Mobile**: Single-column stack, KPI cards in a horizontal carousel, tables as stacked cards [file:8].

### Main Dashboard Content

Organized into four primary rows [file:8]:

1. **KPI strip (Row 1)** – 4–6 KPI cards:
   - Cost savings YTD
   - Automation rate (%)
   - Bot uptime (last 7 days)
   - FTE hours freed
   - Revenue this month (from PSA)
   - Compliance score
2. **Trends & comparisons (Row 2)**:
   - Cost savings over time (line chart).
   - Processes automated by month (bar).
   - Error rate trend (line with threshold).
   - Before/after cycle time comparisons (bar).
3. **Operational tables (Row 3)**:
   - Active automations/bots (status, uptime, errors, owner).
   - Process metrics (volume, cycle time, success rate, savings).
4. **Alerts & compliance (Row 4)**:
   - Alerts feed (HIGH/MED/LOW, filterable).
   - Compliance/audit widget (score, certifications, recent audit events).

### Role-based Views

- **Exec**: High-level KPIs, trends, savings, ROI; minimal low-level logs [file:8].
- **Finance**: Revenue, savings, FTE hours freed, ROI; restricted access to deep technical logs [file:8].
- **Operations**: Process performance, cycle time, error rates, volumes [file:8].
- **IT**: Bot uptime, error details, alerts, compliance/audit events [file:8].

A `<RoleSwitch>` component toggles visible metrics/columns per role [file:8].

---

## Core Components

Key React components and props, as defined in the blueprint [file:8]:

- `DashboardLayout`
  - Props: `userRole`, `tenantId`.
  - Provides layout, role, and date-range context.
- `DashboardHeader`
  - Props: `role`, `onRoleChange`, `dateRange`, `onDateRangeChange`.
- `KpiCardGrid`
  - Props: `metrics: KpiMetric[]`, `loading`.
  - `KpiMetric = { id, label, value, delta, trend, unit, severity }`.
- `TrendChartsSection`
  - Props:
    - `costSavingsSeries`
    - `automationRateSeries`
    - `errorRateSeries`
    - `beforeAfterSeries`
  - Uses Recharts LineChart/BarChart.
- `BotStatusTable`
  - Props: `bots: BotRow[]`, `onRowClick(botId)`.
  - Columns: Name, Process, Status, Uptime %, Last Run, Error Count.
- `ProcessMetricsTable`
  - Props: `processes: ProcessMetricRow[]`.
  - Columns: Process, Volume, Avg Cycle Time, Success %, Savings YTD, Owner.
- `AlertsFeed`
  - Props: `alerts: Alert[]`, `onFilterChange`.
- `CompliancePanel`
  - Props: `score`, `areas`, `certifications`, `recentEvents`.
- `RoleSwitch`
  - Props: `role`, `rolesAvailable`, `onChange`.

---

## API Contracts

All endpoints are tenant-scoped [file:8]:

- `GET /api/dashboard/:tenantId/summary`
  - Returns KPI metrics for `KpiCardGrid`:
  - Example fields: `totalSavingsYtd`, `automationRate`, `botUptime7d`, `fteHoursFreed`, `revenueThisMonth`, `complianceScore`.
- `GET /api/dashboard/:tenantId/trends?from=&to=`
  - Cost savings series, automation rate series, error rate series, before/after per process.
- `GET /api/dashboard/:tenantId/bots?status=`
  - Bot list for `BotStatusTable` with `id`, `name`, `processName`, `status`, `uptimePct`, `lastRunAt`, `lastErrorAt`, `errorCount7d`.
- `GET /api/dashboard/:tenantId/processes`
  - Process metrics for `ProcessMetricsTable` with `id`, `name`, `volume30d`, `avgCycleTime`, `successRate`, `savingsYtd`, `owner`.
- `GET /api/dashboard/:tenantId/alerts?severity=&limit=`
  - Alerts feed for `AlertsFeed`.
- `GET /api/dashboard/:tenantId/compliance`
  - Compliance score and audit snippets for `CompliancePanel`.
- `GET /api/dashboard/:tenantId/stream` (optional)
  - WebSocket or SSE for live alerts/bot status every 5–30 seconds [file:8].

---

## Design System

The dashboard reuses AIITech’s shared design tokens [file:8].

### Colors

- Primary: `#38bdf8` (teal) [file:8].
- Background: `#0f172a` (dark) [file:8].
- Surface: `#111827` / `#1f2933` [file:8].
- Success: `#22c55e`, Warning: `#f59e0b`, Error: `#dc2626` [file:8].

### Typography & Spacing

- System sans (`-apple-system`, `Segoe UI`), 16px body [file:8].
- 24–32px for key KPI numbers to emphasize impact [file:8].
- 4px spacing grid; 16px card padding; 24px section spacing [file:8].

### Accessibility

- WCAG 2.1 AA compliance targeted [file:8].
- Chart colors must have sufficient contrast and always include tooltips/labels [file:8].

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- API/BFF endpoint available for `/api/dashboard/:tenantId/*`
- Valid test token with tenant and role claims

### Installation

```bash
git clone https://github.com/aiistech/client-dashboard.git
cd client-dashboard

npm install
# or
yarn install
