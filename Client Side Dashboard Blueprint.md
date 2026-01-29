**Client Side Dashboard Blueprint**

Here is a concise developer blueprint for the **client-side dashboard** (PSA \+ automation console), so an engineer can go straight to implementation.[\[1\]](#bookmark=id.p4mll9xna9s4)[\[2\]](#bookmark=id.4bw95wd3lj6g)

**High-level goals**

* Single **“Command Center”** for clients to see project, financial, and automation health in one place.[\[1\]](#bookmark=id.p4mll9xna9s4)

* Role-based variants for **Executive, Finance, Operations, IT** with the same layout but different metrics and filters.[\[2\]](#bookmark=id.4bw95wd3lj6g)[\[1\]](#bookmark=id.p4mll9xna9s4)

* Real-time or near-real-time view of automation status, savings, and exceptions, integrated with PSA data.[\[2\]](#bookmark=id.4bw95wd3lj6g)

**Layout & information architecture**

Top-level layout (desktop, \~1200px wide):[\[1\]](#bookmark=id.p4mll9xna9s4)

* **Header (top bar)**

  * Left: logo, workspace selector, environment badge (Prod/Sandbox).

  * Center: global date range selector (Today / 7d / 30d / Custom).

  * Right: role switcher (Exec / Ops / Finance / IT), notifications bell, user menu.

* **Main content area**

  * **Row 1 – KPI strip** (4–6 cards)

    * Examples:

      * Cost savings YTD

      * Automation rate (overall %)

      * Bot uptime (last 7 days)

      * FTE hours freed

      * Revenue this month (from PSA)

      * Compliance score (security/regulatory)

  * **Row 2 – Trend & comparison charts**

    * Cost savings over time (line chart).

    * Processes automated by month (bar).

    * Error rate trend (line with threshold).

    * Before/after cycle time comparison (bar).

  * **Row 3 – Operational tables**

    * Active automations / bots table (status, uptime, errors, owner).

    * Process metrics table (volume, cycle time, success rate, savings).

  * **Row 4 – Alerts & compliance**

    * Alerts feed (HIGH / MEDIUM / LOW, filterable).

    * Compliance/audit widget (score, certifications, recent audit events).

* **Side navigation (left)**

  * Dashboard (default)

  * Automations

  * Processes

  * Projects & Billing

  * Compliance & Audit

  * Settings

Mobile: 1-column stack, KPI cards in horizontal carousel; tables become stacked cards.[\[2\]](#bookmark=id.4bw95wd3lj6g)[\[1\]](#bookmark=id.p4mll9xna9s4)

**Core components & props (React)**

Target stack: **React \+ TypeScript \+ Tailwind \+ Recharts \+ Axios**.[\[1\]](#bookmark=id.p4mll9xna9s4)[\[2\]](#bookmark=id.4bw95wd3lj6g)

* `<DashboardLayout>`

  * Props: `userRole`, `tenantId`.

  * Renders header, sidebar, and child routes; provides context (role, date range).

* `<DashboardHeader>`

  * Props: `role`, `onRoleChange`, `dateRange`, `onDateRangeChange`.

  * Contains logo, workspace dropdown, role selector, notifications, user menu.

* `<KpiCardGrid>`

  * Props: `metrics: KpiMetric[]`, `loading`.

  * `KpiMetric`: `{ id, label, value, delta, trend, unit, severity }`.

  * Shows 4–6 cards; card color varies by severity (success/warn/error).

* `<TrendChartsSection>`

  * Props:

    * `costSavingsSeries` (array of {date, value}).

    * `automationRateSeries`.

    * `errorRateSeries`.

    * `beforeAfterSeries` (per-process pair).

  * Uses Recharts LineChart/BarChart; all charts share date-range filter.

* `<BotStatusTable>`

  * Props: `bots: BotRow[]`, `onRowClick(botId)`.

  * Columns: Name, Process, Status, Uptime %, Last Run, Error Count.

  * Supports sort, filter by status; expandable row to show last runs.

* `<ProcessMetricsTable>`

  * Props: `processes: ProcessMetricRow[]`.

  * Columns: Process, Volume, Avg Cycle Time, Success %, Savings YTD, Owner.

* `<AlertsFeed>`

  * Props: `alerts: Alert[]`, `onFilterChange(severity|source)`.

  * Shows time, severity, title, description, related process/bot; filter chip bar.

* `<CompliancePanel>`

  * Props: `score`, `areas`, `certifications`, `recentEvents`.

  * Circular progress for overall score; list of areas (e.g., HIPAA, SOX), each with sub-score.

* `<RoleSwitch>`

  * Props: `role`, `rolesAvailable`, `onChange`.

  * Changes which metrics & columns are visible by applying a simple mapping (e.g., Exec hides low-level logs).[\[1\]](#bookmark=id.p4mll9xna9s4)

**Data contracts & API endpoints**

Base: `/api/dashboard/:tenantId` (or `/tenants/:tenantId/dashboard` in BFF).[\[1\]](#bookmark=id.p4mll9xna9s4)

* **GET /dashboard/summary**

  * Returns KPI metrics and global stats, shaped for `<KpiCardGrid>`.

  * Response sample:

    * `totalSavingsYtd`

    * `automationRate`

    * `botUptime7d`

    * `fteHoursFreed`

    * `revenueThisMonth`

    * `complianceScore`

* **GET /dashboard/trends?from=\&to=**

  * Cost savings series.

  * Automation rate series.

  * Error rate series.

  * Before/after comparisons per process.

* **GET /dashboard/bots?status=**

  * Bot list for `<BotStatusTable>`.

  * Each row: `{ id, name, processName, status, uptimePct, lastRunAt, lastErrorAt, errorCount7d }`.

* **GET /dashboard/processes**

  * Process metrics for `<ProcessMetricsTable>`.

  * Row: `{ id, name, volume30d, avgCycleTime, successRate, savingsYtd, owner }`.

* **GET /dashboard/alerts?severity=\&limit=**

  * Alerts feed for `<AlertsFeed>`.

* **GET /dashboard/compliance**

  * Score and audit snippets for `<CompliancePanel>`.

Optional: WebSocket or SSE at `/dashboard/stream` for live alerts and bot status updates (5–30 second refresh).[\[2\]](#bookmark=id.4bw95wd3lj6g)

**State management & behavior**

* Use **React Query** (or SWR) for data fetching \+ caching; key off `tenantId`, `role`, `dateRange`.

* Derived role views: apply mapping to which metrics/columns show; avoid separate endpoints if possible.

* Auto-refresh:

  * KPIs/charts: refresh every 60–300 seconds.

  * Alerts/bot status: every 5–15 seconds or via WebSocket push.

* Errors: show banner \+ per-widget error states (empty/error placeholders).

**RBAC and security considerations**

* Frontend gets a **signed JWT** or opaque token with claims: `tenantId`, `roles`, `scopes`.

* All dashboard calls must include tenant and are validated server-side; no role logic trusted solely in frontend.

* Per-component guards: hide or disable sections user is not allowed to see (e.g., finance cannot view IT logs).

**Visual design tokens (summary)**

From existing design system for site and dashboard.[\[1\]](#bookmark=id.p4mll9xna9s4)

* Colors:

  * Primary: `#38bdf8` (teal).

  * Background: `#0f172a` (dark), surface: `#111827` / `#1f2933`.

  * Success: `#22c55e`, Warning: `#f59e0b`, Error: `#dc2626`.

* Typography: system sans (`-apple-system`, `Segoe UI`), 16px body, 24–32px for key KPI numbers.

* Spacing: 4px grid, 16px card padding, 24px section spacing.

* Accessibility: WCAG 2.1 AA; ensure chart colors have sufficient contrast and include labels/tooltips.

**Implementation phases (client dashboard only)**

* **Week 1–2**: Layout \+ static components (header, sidebar, cards, tables, charts with mock data).

* **Week 3–4**: Wire to real APIs / BFF, implement role-based filtering and date-range handling.

* **Week 5–6**: Add WebSocket/SSE for alerts, optimize performance, do accessibility and responsive QA.

If you want, the next step can be a very concrete artifact: e.g., a `routes/dashboard.tsx` file structure with component imports, or a JSON schema for the `/dashboard/summary` endpoint.