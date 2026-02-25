import React, { useState, useEffect, useMemo } from 'react';
import { 
  HomeIcon, 
  CpuChipIcon, 
  Square3Stack3DIcon, 
  BanknotesIcon, 
  ShieldCheckIcon, 
  Cog6ToothIcon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  ChartPieIcon,
  BoltIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  BriefcaseIcon,
  CreditCardIcon,
  ArrowPathIcon,
  SparklesIcon,
  PlusIcon,
  LockClosedIcon,
  DocumentCheckIcon,
  ShieldExclamationIcon,
  ArrowsPointingOutIcon,
  GlobeAltIcon,
  UsersIcon,
  FingerPrintIcon,
  ChatBubbleLeftRightIcon,
  PuzzlePieceIcon,
  KeyIcon,
  TrashIcon,
  LinkIcon,
  CloudArrowUpIcon,
  CircleStackIcon,
  CommandLineIcon,
  CreditCardIcon as BillingIcon,
  ShieldCheckIcon as PrivacyIcon,
  SunIcon,
  MoonIcon,
  ArrowRightCircleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ServerIcon,
  ClipboardDocumentCheckIcon,
  QueueListIcon,
  TableCellsIcon,
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  DocumentArrowDownIcon,
  ReceiptPercentIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie, AreaChart, Area, ComposedChart, RadialBarChart, RadialBar
} from 'recharts';

// --- Types ---
type UserRole = 'Executive' | 'Operations' | 'Finance' | 'IT';
type DateRange = 'Today' | '7d' | '30d' | 'Custom';
type Severity = 'success' | 'warn' | 'error' | 'neutral';
type IntegrationStatus = 'Connected' | 'Not Connected' | 'Error' | 'Degraded';
type BotStatus = 'Running' | 'Idle' | 'Error' | 'Maintenance' | 'Paused';
type ProjectStatus = 'On Track' | 'At Risk' | 'Delayed' | 'Completed' | 'Planning';

interface KpiMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'neutral';
  unit: string;
  severity: Severity;
}

interface ActivityLog {
  id: number;
  type: string;
  message: string;
  time: string;
  status: Severity;
}

interface Bot {
    id: string;
    name: string;
    type: string;
    status: BotStatus;
    uptime: string;
    successRate: number;
    tasksProcessed: number;
    nextRun: string;
    department: string;
}

interface ProcessStage {
    id: string;
    name: string;
    color: string;
}

interface ProcessInstance {
    id: string;
    title: string;
    owner: string;
    stageId: string;
    timeInStage: string;
    totalTime: string;
    priority: 'Low' | 'Medium' | 'High';
    avatar: string;
}

interface BusinessProcess {
    id: string;
    name: string;
    health: number; // 0-100
    activeCount: number;
    avgCompletionTime: string;
    stages: ProcessStage[];
    instances: ProcessInstance[];
}

interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    progress: number;
    dueDate: string;
    owner: string;
    budget: { used: number; total: number };
    team: string[];
    risk: 'Low' | 'Medium' | 'High';
    nextMilestone: string;
}

interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'Paid' | 'Pending' | 'Overdue';
    items: number;
}

interface ComplianceControl {
    id: string;
    name: string;
    status: 'Pass' | 'Fail' | 'Warn';
    category: string;
    lastChecked: string;
}

interface ComplianceFramework {
    name: string;
    score: number;
    status: 'Compliant' | 'At Risk' | 'Non-Compliant';
    controlsPassing: number;
    totalControls: number;
    lastCheck: string;
}

// --- Mock Data ---
const MOCK_DATA = {
  KPI: {
    Executive: [
      { id: '1', label: 'Compliance Score', value: '94/100', delta: '+2', trend: 'up', unit: 'score', severity: 'success' },
      { id: '2', label: 'Revenue (PSA)', value: '$4.8M', delta: '+5%', trend: 'up', unit: 'currency', severity: 'success' },
      { id: '3', label: 'Automation Rate', value: '68%', delta: '+3%', trend: 'up', unit: 'percent', severity: 'success' },
      { id: '4', label: 'Active Integrations', value: '12', delta: '+1', trend: 'up', unit: 'count', severity: 'success' },
    ],
    Operations: [
      { id: '1', label: 'Bot Uptime', value: '99.8%', delta: '+0.1%', trend: 'up', unit: 'percent', severity: 'success' },
      { id: '2', label: 'FTE Hours Freed', value: '12,400', delta: '+800', trend: 'up', unit: 'hours', severity: 'success' },
      { id: '3', label: 'Audit Events', value: '1,240', delta: '+45', trend: 'up', unit: 'count', severity: 'success' },
      { id: '4', label: 'Integration Health', value: '96%', delta: '-2%', trend: 'down', unit: 'percent', severity: 'warn' },
    ],
    Finance: [
      { id: '1', label: 'Cost Savings YTD', value: '$1.2M', delta: '+12%', trend: 'up', unit: 'currency', severity: 'success' },
      { id: '2', label: 'ROI (Projected)', value: '3.4x', delta: '+0.2', trend: 'up', unit: 'ratio', severity: 'success' },
      { id: '3', label: 'Invoiced Amount', value: '$580k', delta: '+18%', trend: 'up', unit: 'currency', severity: 'success' },
      { id: '4', label: 'Auto-Sync Success', value: '100%', delta: '0%', trend: 'neutral', unit: 'percent', severity: 'success' },
    ],
    IT: [
      { id: '1', label: 'System Health', value: 'Optimal', delta: 'Steady', trend: 'neutral', unit: 'text', severity: 'success' },
      { id: '2', label: 'API Call Vol', value: '240k', delta: '+12k', trend: 'up', unit: 'count', severity: 'success' },
      { id: '3', label: 'Uptime (Agg)', value: '99.99%', delta: '0%', trend: 'neutral', unit: 'percent', severity: 'success' },
      { id: '4', label: 'Security Score', value: '98/100', delta: '0', trend: 'neutral', unit: 'score', severity: 'success' },
    ]
  },
  Trends: {
    Monthly: [
      { date: 'Jan', savings: 45000, automation: 45, successRate: 92, revenue: 380000, syncHealth: 99.1 },
      { date: 'Feb', savings: 52000, automation: 48, successRate: 93, revenue: 410000, syncHealth: 99.4 },
      { date: 'Mar', savings: 61000, automation: 52, successRate: 95, revenue: 450000, syncHealth: 99.8 },
      { date: 'Apr', savings: 58000, automation: 55, successRate: 94, revenue: 430000, syncHealth: 98.2 },
      { date: 'May', savings: 72000, automation: 60, successRate: 96, revenue: 490000, syncHealth: 99.1 },
      { date: 'Jun', savings: 85000, automation: 65, successRate: 97, revenue: 520000, syncHealth: 99.7 },
      { date: 'Jul', savings: 92000, automation: 68, successRate: 96, revenue: 580000, syncHealth: 99.9 },
    ],
    Daily: [
      { date: 'Mon', savings: 2000, revenue: 15000 },
      { date: 'Tue', savings: 2200, revenue: 16500 },
      { date: 'Wed', savings: 1800, revenue: 14000 },
      { date: 'Thu', savings: 2500, revenue: 18000 },
      { date: 'Fri', savings: 2800, revenue: 19500 },
      { date: 'Sat', savings: 1500, revenue: 11000 },
      { date: 'Sun', savings: 1200, revenue: 9000 },
    ],
    Hourly: [
      { date: '08:00', savings: 200, revenue: 1200 },
      { date: '10:00', savings: 450, revenue: 2800 },
      { date: '12:00', savings: 600, revenue: 3500 },
      { date: '14:00', savings: 550, revenue: 3100 },
      { date: '16:00', savings: 700, revenue: 4200 },
      { date: '18:00', savings: 300, revenue: 1500 },
    ]
  },
  IntegrationKPIs: [
    { id: 'i1', label: 'Active Connectors', value: '12', delta: '+2', trend: 'up', unit: 'count', severity: 'success' },
    { id: 'i2', label: 'Sync Success Rate', value: '99.7%', delta: '+0.2%', trend: 'up', unit: 'percent', severity: 'success' },
    { id: 'i3', label: 'Avg Latency', value: '1.2s', delta: '-0.4s', trend: 'up', unit: 'time', severity: 'success' },
    { id: 'i4', label: 'Data Points Sync\'d', value: '4.2M', delta: '+15%', trend: 'up', unit: 'count', severity: 'success' },
  ],
  Integrations: [
    { id: 'it1', name: 'QuickBooks Online', category: 'Accounting', status: 'Connected', lastSync: '12m ago', icon: '💸', valueProp: 'Sync invoices and expenses for automated revenue recognition.' },
    { id: 'it2', name: 'Salesforce', category: 'CRM', status: 'Connected', lastSync: '5m ago', icon: '☁️', valueProp: 'Automate lead-to-project conversion and client billing sync.' },
    { id: 'it3', name: 'Slack', category: 'Communication', status: 'Degraded', lastSync: '1h ago', icon: '💬', valueProp: 'Push real-time automation alerts to dedicated channels.' },
    { id: 'it4', name: 'NetSuite', category: 'Accounting', status: 'Not Connected', lastSync: 'N/A', icon: '🏢', valueProp: 'Full bi-directional sync of financial entities.' },
    { id: 'it5', name: 'Okta', category: 'Identity', status: 'Connected', lastSync: 'Just now', icon: '🔑', valueProp: 'Unified SSO and role-based access control.' },
    { id: 'it6', name: 'HubSpot', category: 'CRM', status: 'Not Connected', lastSync: 'N/A', icon: '🧡', valueProp: 'Sync marketing leads with project intake workflows.' },
    { id: 'it7', name: 'Xero', category: 'Accounting', status: 'Not Connected', lastSync: 'N/A', icon: '🔵', valueProp: 'Streamline bank reconciliations and financial reporting.' },
  ],
  Bots: [
      { id: 'b1', name: 'Invoice_Bot_Alpha', type: 'Financial Processing', status: 'Running', uptime: '14d 2h', successRate: 99.2, tasksProcessed: 14020, nextRun: 'Continuous', department: 'Finance' },
      { id: 'b2', name: 'Onboarding_Agent_01', type: 'HR Workflow', status: 'Idle', uptime: '2d 5h', successRate: 96.5, tasksProcessed: 340, nextRun: '15m', department: 'HR' },
      { id: 'b3', name: 'SAP_Connector_X', type: 'Data Sync', status: 'Error', uptime: '4h 12m', successRate: 88.0, tasksProcessed: 1205, nextRun: 'Retry in 2m', department: 'IT' },
      { id: 'b4', name: 'Email_Triage_Bot', type: 'Communication', status: 'Running', uptime: '32d 1h', successRate: 99.9, tasksProcessed: 56000, nextRun: 'Continuous', department: 'Ops' },
      { id: 'b5', name: 'Report_Gen_Z', type: 'Reporting', status: 'Maintenance', uptime: 'N/A', successRate: 100, tasksProcessed: 0, nextRun: 'Scheduled: 2AM', department: 'Finance' },
      { id: 'b6', name: 'Lead_Scraper_Pro', type: 'Marketing', status: 'Paused', uptime: '5d 2h', successRate: 94.2, tasksProcessed: 2300, nextRun: 'Manual', department: 'Sales' },
  ] as Bot[],
  Processes: [
      {
          id: 'p1',
          name: 'Invoice Approval',
          health: 98,
          activeCount: 24,
          avgCompletionTime: '2.4 days',
          stages: [
              { id: 's1', name: 'Received', color: 'bg-blue-500' },
              { id: 's2', name: 'AI Extraction', color: 'bg-indigo-500' },
              { id: 's3', name: 'Validation', color: 'bg-amber-500' },
              { id: 's4', name: 'Approval', color: 'bg-emerald-500' },
          ],
          instances: [
              { id: 'i1', title: 'Inv #9923 - Acme Corp', owner: 'M. Ross', stageId: 's4', timeInStage: '2h', totalTime: '1d', priority: 'High', avatar: 'MR' },
              { id: 'i2', title: 'Inv #9924 - Globex', owner: 'Bot_01', stageId: 's2', timeInStage: '1m', totalTime: '1m', priority: 'Medium', avatar: '🤖' },
              { id: 'i3', title: 'Inv #9921 - Stark Ind', owner: 'S. Jenkins', stageId: 's3', timeInStage: '4d', totalTime: '5d', priority: 'High', avatar: 'SJ' },
              { id: 'i4', title: 'Inv #9925 - Umbrella', owner: 'Bot_01', stageId: 's1', timeInStage: '10m', totalTime: '10m', priority: 'Low', avatar: '🤖' },
              { id: 'i5', title: 'Inv #9920 - Cyberdyne', owner: 'A. Rivers', stageId: 's4', timeInStage: '1h', totalTime: '3d', priority: 'Medium', avatar: 'AR' },
          ]
      },
      {
          id: 'p2',
          name: 'Employee Onboarding',
          health: 85,
          activeCount: 8,
          avgCompletionTime: '5.1 days',
          stages: [
              { id: 's1', name: 'Offer Signed', color: 'bg-blue-500' },
              { id: 's2', name: 'IT Provisioning', color: 'bg-indigo-500' },
              { id: 's3', name: 'Payroll Setup', color: 'bg-amber-500' },
              { id: 's4', name: 'Orientation', color: 'bg-emerald-500' },
          ],
          instances: [
              { id: 'i10', title: 'New Hire: J. Doe', owner: 'HR_Bot', stageId: 's2', timeInStage: '2d', totalTime: '3d', priority: 'High', avatar: '🤖' },
              { id: 'i11', title: 'New Hire: A. Smith', owner: 'E. Vance', stageId: 's2', timeInStage: '4h', totalTime: '1d', priority: 'Medium', avatar: 'EV' },
              { id: 'i12', title: 'New Hire: B. Wayne', owner: 'M. Ross', stageId: 's3', timeInStage: '5d', totalTime: '8d', priority: 'High', avatar: 'MR' },
          ]
      }
  ] as BusinessProcess[],
  Projects: [
      {
          id: 'pr1',
          name: 'Global ERP Migration',
          description: 'Consolidating legacy SAP instances into cloud tenant.',
          status: 'At Risk',
          progress: 65,
          dueDate: 'Nov 15, 2024',
          owner: 'Elena Vance',
          budget: { used: 450000, total: 600000 },
          team: ['EV', 'DK', 'MR'],
          risk: 'High',
          nextMilestone: 'Data Validation Phase'
      },
      {
          id: 'pr2',
          name: 'AI Support Rollout',
          description: 'Deploying GenAI agents for Tier 1 customer support.',
          status: 'On Track',
          progress: 40,
          dueDate: 'Dec 01, 2024',
          owner: 'Sarah Jenkins',
          budget: { used: 120000, total: 500000 },
          team: ['SJ', 'AR'],
          risk: 'Low',
          nextMilestone: 'UAT Testing'
      },
      {
          id: 'pr3',
          name: 'Q3 Financial Audit',
          description: 'Automating reconciliation for external audit prep.',
          status: 'Delayed',
          progress: 85,
          dueDate: 'Oct 10, 2024',
          owner: 'Michael Ross',
          budget: { used: 45000, total: 50000 },
          team: ['MR', 'EV'],
          risk: 'Medium',
          nextMilestone: 'Final Report Gen'
      },
      {
          id: 'pr4',
          name: 'Data Warehouse Refactor',
          description: 'Optimizing Snowflake schemas for cost reduction.',
          status: 'On Track',
          progress: 15,
          dueDate: 'Jan 20, 2025',
          owner: 'Dmitri Kozlov',
          budget: { used: 5000, total: 80000 },
          team: ['DK'],
          risk: 'Low',
          nextMilestone: 'Schema Design'
      },
      {
          id: 'pr5',
          name: 'Cybersecurity Policy Update',
          description: 'Implementing new ISO 27001 controls.',
          status: 'Completed',
          progress: 100,
          dueDate: 'Sep 30, 2024',
          owner: 'Alex Rivers',
          budget: { used: 25000, total: 30000 },
          team: ['AR', 'EV'],
          risk: 'Low',
          nextMilestone: 'Closed'
      }
  ] as Project[],
  Invoices: [
      { id: 'INV-00924', date: 'Sep 01, 2024', amount: '$12,450.00', status: 'Paid', items: 12 },
      { id: 'INV-01024', date: 'Oct 01, 2024', amount: '$14,200.50', status: 'Paid', items: 14 },
      { id: 'INV-01124', date: 'Nov 01, 2024', amount: '$13,800.00', status: 'Paid', items: 8 },
      { id: 'INV-01224', date: 'Dec 01, 2024', amount: '$15,120.00', status: 'Pending', items: 16 },
  ] as Invoice[],
  CostBreakdown: [
      { name: 'Compute Resources', value: 4500, color: '#3b82f6' },
      { name: 'API Usage', value: 3200, color: '#8b5cf6' },
      { name: 'Storage', value: 1800, color: '#10b981' },
      { name: 'Seat Licenses', value: 5620, color: '#f59e0b' },
  ],
  SpendTrend: [
      { date: '1', amount: 420 },
      { date: '5', amount: 480 },
      { date: '10', amount: 510 },
      { date: '15', amount: 490 },
      { date: '20', amount: 550 },
      { date: '25', amount: 600 },
      { date: '30', amount: 580 },
  ],
  Compliance: {
    score: 94,
    lastAudit: '2h ago',
    criticalIssues: 0,
    openRisks: 3,
    frameworks: [
      { name: 'SOC 2 Type II', status: 'Compliant', score: 100, lastCheck: '1d ago', totalControls: 64, controlsPassing: 64 },
      { name: 'ISO 27001', status: 'At Risk', score: 92, lastCheck: '4h ago', totalControls: 114, controlsPassing: 105 },
      { name: 'GDPR', status: 'Compliant', score: 98, lastCheck: '1d ago', totalControls: 42, controlsPassing: 41 },
      { name: 'HIPAA', status: 'Compliant', score: 100, lastCheck: '12h ago', totalControls: 56, controlsPassing: 56 },
    ] as ComplianceFramework[],
    controls: [
      { id: 'C-001', name: 'Multi-Factor Authentication', status: 'Pass', category: 'Access Control', lastChecked: '10m ago' },
      { id: 'C-002', name: 'Data Encryption at Rest', status: 'Pass', category: 'Data Protection', lastChecked: '1h ago' },
      { id: 'C-003', name: 'Vendor Risk Assessment', status: 'Warn', category: 'Governance', lastChecked: '2d ago' },
      { id: 'C-004', name: 'Incident Response Plan', status: 'Pass', category: 'Operations', lastChecked: '1w ago' },
      { id: 'C-005', name: 'Access Review (Quarterly)', status: 'Fail', category: 'Access Control', lastChecked: '4h ago' },
      { id: 'C-006', name: 'Endpoint Protection', status: 'Pass', category: 'Infrastructure', lastChecked: '5m ago' },
    ] as ComplianceControl[],
    logs: [
        { id: 101, action: 'Policy Updated: Password Complexity', user: 'Alex Rivers', time: '2h ago', status: 'success' },
        { id: 102, action: 'Failed Login: Admin Panel', user: 'Unknown IP', time: '4h ago', status: 'error' },
        { id: 103, action: 'Data Export: Financial Records', user: 'Michael Ross', time: '6h ago', status: 'warn' },
        { id: 104, action: 'New User Provisioned', user: 'System', time: '12h ago', status: 'success' },
        { id: 105, action: 'Firewall Rule Change', user: 'Elena Vance', time: '1d ago', status: 'neutral' },
    ]
  },
  TeamUsers: [
    { id: 'u1', name: 'Alex Rivers', email: 'alex@aiistech.com', role: 'Executive', status: 'Active', avatar: 'AR', lastActive: '2m ago' },
    { id: 'u2', name: 'Sarah Jenkins', email: 'sarah.j@aiistech.com', role: 'Operations', status: 'Active', avatar: 'SJ', lastActive: '15m ago' },
    { id: 'u3', name: 'Michael Ross', email: 'm.ross@aiistech.com', role: 'Finance', status: 'Active', avatar: 'MR', lastActive: '1h ago' },
    { id: 'u4', name: 'Elena Vance', email: 'elena@aiistech.com', role: 'IT', status: 'Active', avatar: 'EV', lastActive: 'Just now' },
    { id: 'u5', name: 'Dmitri Kozlov', email: 'dmitri@aiistech.com', role: 'Operations', status: 'Invited', avatar: 'DK', lastActive: 'N/A' },
  ],
  Roles: [
    { name: 'Executive', access: 'Full platform visibility, strategic KPIs, high-level financial reporting.' },
    { name: 'Finance', access: 'Billing, Invoices, Revenue metrics, and Accounting integrations.' },
    { name: 'Operations', access: 'Bot management, Process health, FTE metrics, and incident logs.' },
    { name: 'IT', access: 'Audit logs, system health, security configuration, and API management.' },
  ],
  Subscription: {
    plan: 'Professional',
    renewalDate: '2025-01-12',
    limits: [
      { label: 'Active Seats', used: 8, total: 20 },
      { label: 'Automation Bots', used: 42, total: 100 },
      { label: 'API Requests / mo', used: '240k', total: '1M' },
    ],
    billingContact: 'Alex Rivers',
    billingEmail: 'finance-team@aiistech.com'
  },
  BotPerformance: [
    { name: 'Active', value: 42, color: '#10b981' },
    { name: 'Idle', value: 12, color: '#64748b' },
    { name: 'Maintenance', value: 5, color: '#f59e0b' },
    { name: 'Error', value: 2, color: '#f43f5e' },
  ],
  DepartmentEfficiency: [
    { name: 'Finance', manual: 400, automated: 1200 },
    { name: 'HR', manual: 300, automated: 800 },
    { name: 'IT', manual: 200, automated: 1500 },
    { name: 'Ops', manual: 500, automated: 900 },
  ],
  RecentActivity: [
    { id: 1, type: 'bot', message: 'Invoice_Bot_04 completed batch processing.', time: '2m ago', status: 'success' },
    { id: 2, type: 'alert', message: 'High latency detected in SAP connector.', time: '15m ago', status: 'warn' },
    { id: 3, type: 'user', message: 'Sarah Jenkins updated compliance policies.', time: '1h ago', status: 'neutral' },
    { id: 4, type: 'bot', message: 'Onboarding_Bot_01 failed to sync user profile.', time: '2h ago', status: 'error' },
    { id: 5, type: 'system', message: 'Scheduled maintenance window completed.', time: '4h ago', status: 'success' },
  ] as ActivityLog[]
};

// --- Helper Functions ---

const generateRandomLog = (id: number): ActivityLog => {
  const types = ['bot', 'alert', 'user', 'system'];
  const messages = [
     'Invoice_Bot_04 processed batch #992.',
     'High latency in SAP connector (1.2s).',
     'User Alex updated security policies.',
     'System backup completed successfully.',
     'New integration connected: HubSpot.',
     'Bot Fleet auto-scaled to 45 units.',
     'Compliance check passed for Q3.',
     'Data sync failed for Legacy_ERP.',
     'API Limit Reached: 80% warning.',
     'New user invited: j.smith@aiistech.com'
  ];
  const statuses: Severity[] = ['success', 'warn', 'neutral', 'success', 'success', 'success', 'success', 'error', 'warn', 'neutral'];
  
  const randIdx = Math.floor(Math.random() * messages.length);
  return {
    id,
    type: types[Math.floor(Math.random() * types.length)],
    message: messages[randIdx],
    time: 'Just now',
    status: statuses[randIdx]
  };
};

// --- View Components ---

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-10 h-10 relative flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-fuchsia-600/30 rounded-full blur-md opacity-60"></div>
      <div className="relative z-10 w-full h-full text-white">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
          <path d="M50,20 C35,20 20,30 20,50 C20,65 30,75 45,78 C47,79 49,80 50,80" fill="none" stroke="url(#brainGradient)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M50,20 C65,20 80,30 80,50 C80,65 70,75 55,78 C53,79 51,80 50,80" fill="none" stroke="url(#brainGradient)" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="url(#brainGradient)" strokeWidth="1.5" strokeDasharray="2,4" />
          <circle cx="50" cy="50" r="4" fill="url(#brainGradient)" className="animate-pulse" />
          <defs>
            <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
    <span className="font-extrabold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-200 to-fuchsia-400">AIISTECH</span>
  </div>
);

const Header = ({ role, setRole, dateRange, setDateRange }: { role: UserRole, setRole: (r: UserRole) => void, dateRange: DateRange, setDateRange: (d: DateRange) => void }) => (
  <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-xl shrink-0 z-50">
    <div className="flex items-center gap-4">
      <div className="bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700 text-xs font-semibold text-slate-300">Workspace Alpha</div>
      <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase">Production</div>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-lg">
        {['Today', '7d', '30d'].map(range => (
          <button key={range} onClick={() => setDateRange(range as DateRange)} className={`px-3 py-1 rounded text-xs font-medium transition-all ${dateRange === range ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>{range}</button>
        ))}
      </div>
      <div className="relative flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Role:</span>
        <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="bg-transparent text-xs font-bold text-slate-200 outline-none cursor-pointer appearance-none pr-4">
          {['Executive', 'Operations', 'Finance', 'IT'].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <ChevronDownIcon className="absolute right-3 w-3 h-3 text-slate-500 pointer-events-none" />
      </div>
      <BellIcon className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
      <UserCircleIcon className="w-8 h-8 text-slate-500 hover:text-slate-300 cursor-pointer border border-slate-800 rounded-full" />
    </div>
  </header>
);

const KpiCard: React.FC<{ metric: KpiMetric, sparkData?: any[] }> = ({ metric, sparkData }) => {
  const severityColors = { success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', warn: 'text-amber-400 bg-amber-500/10 border-amber-500/20', error: 'text-rose-400 bg-rose-500/10 border-rose-500/20', neutral: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };
  const sparkColor = metric.severity === 'success' ? '#34d399' : metric.severity === 'warn' ? '#fbbf24' : '#fb7185';

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{metric.label}</span>
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${severityColors[metric.severity]}`}>
          {metric.trend === 'up' ? '▲' : metric.trend === 'down' ? '▼' : '●'} {metric.delta}
        </div>
      </div>
      <div className="flex items-end justify-between relative z-10">
          <h3 className="text-2xl font-bold text-white tracking-tight">{metric.value}</h3>
           {sparkData && (
              <div className="w-24 h-8 -mb-1">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData}>
                        <Line type="monotone" dataKey="val" stroke={sparkColor} strokeWidth={2} dot={false} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
          )}
      </div>
      {/* Background Glow */}
       <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-10 pointer-events-none ${metric.severity === 'success' ? 'bg-emerald-500' : metric.severity === 'warn' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
    </div>
  );
};

// --- View: Compliance Audit View ---
const ComplianceView = () => {
    return (
        <main className="flex-1 overflow-y-auto bg-slate-950 p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <ShieldCheckIcon className="w-8 h-8 text-blue-500" /> Compliance Audit
                    </h2>
                    <p className="text-slate-400 mt-2 font-medium">
                        Unified security command center. Monitor compliance frameworks, audit logs, and control effectiveness.
                    </p>
                </div>
                <div className="flex gap-2">
                     <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all border border-slate-700">
                        <ArrowDownTrayIcon className="w-4 h-4" /> Download Report
                     </button>
                     <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                        <PlayIcon className="w-4 h-4" /> Run Assessment
                     </button>
                </div>
            </div>

            {/* Compliance KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Overall Score', value: MOCK_DATA.Compliance.score + '/100', sub: 'Last check ' + MOCK_DATA.Compliance.lastAudit, icon: ShieldCheckIcon, color: 'text-emerald-400' },
                    { label: 'Critical Issues', value: MOCK_DATA.Compliance.criticalIssues.toString(), sub: 'Requires immediate attention', icon: ExclamationTriangleIcon, color: 'text-rose-400' },
                    { label: 'Open Risks', value: MOCK_DATA.Compliance.openRisks.toString(), sub: 'Mitigation plan active', icon: EyeIcon, color: 'text-amber-400' },
                    { label: 'Active Policies', value: '42', sub: '100% Coverage', icon: DocumentCheckIcon, color: 'text-blue-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-100">{stat.value}</h4>
                            <p className="text-[10px] font-medium text-slate-500 mt-1">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Frameworks & Audit Logs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Frameworks Status */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <LockClosedIcon className="w-5 h-5 text-indigo-400" /> Compliance Frameworks
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MOCK_DATA.Compliance.frameworks.map((fw, idx) => (
                            <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-sm font-bold text-slate-200">{fw.name}</h4>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-widest ${
                                        fw.status === 'Compliant' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                    }`}>{fw.status}</span>
                                </div>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-extrabold text-white">{fw.score}%</span>
                                    <span className="text-[10px] text-slate-500 mb-1">{fw.controlsPassing}/{fw.totalControls} Controls</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${fw.score >= 95 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${fw.score}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Security Log */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col h-[400px]">
                    <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
                        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                            <CommandLineIcon className="w-5 h-5 text-slate-400" /> Security Audit Log
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Live</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-0">
                        <div className="divide-y divide-slate-800/50">
                            {MOCK_DATA.Compliance.logs.map((log) => (
                                <div key={log.id} className="p-4 flex gap-4 hover:bg-slate-800/30 transition-all text-xs">
                                    <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                                        log.status === 'success' ? 'bg-emerald-500' : 
                                        log.status === 'error' ? 'bg-rose-500' : 
                                        log.status === 'warn' ? 'bg-amber-500' : 'bg-slate-500'
                                    }`}></div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-200">{log.action}</p>
                                        <div className="flex justify-between mt-1 text-slate-500 font-mono text-[10px]">
                                            <span>User: {log.user}</span>
                                            <span>{log.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Matrix */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <AdjustmentsHorizontalIcon className="w-5 h-5 text-blue-400" /> Controls Matrix
                    </h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded-lg bg-slate-800 text-[10px] font-bold text-slate-400 border border-slate-700 hover:text-white">Filter by Status</button>
                    </div>
                </div>
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/50 text-slate-500 uppercase font-bold tracking-widest text-[9px]">
                        <tr>
                            <th className="px-6 py-4">Control Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Last Checked</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {MOCK_DATA.Compliance.controls.map((ctrl) => (
                            <tr key={ctrl.id} className="hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200">{ctrl.name} <span className="text-slate-600 font-mono text-[9px] ml-2">#{ctrl.id}</span></td>
                                <td className="px-6 py-4 text-slate-400">{ctrl.category}</td>
                                <td className="px-6 py-4 text-slate-500 font-mono">{ctrl.lastChecked}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${
                                        ctrl.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        ctrl.status === 'Fail' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    }`}>
                                        {ctrl.status === 'Pass' ? 'Operational' : ctrl.status === 'Fail' ? 'Failed' : 'Warning'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
};

// --- View: Billing View ---
const BillingView = () => {
    return (
        <main className="flex-1 overflow-y-auto bg-slate-950 p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <BanknotesIcon className="w-8 h-8 text-blue-500" /> Financial Overview
                    </h2>
                    <p className="text-slate-400 mt-2 font-medium">
                        Billing history, cost analysis, and payment method management.
                    </p>
                </div>
                <div className="flex gap-2">
                     <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all border border-slate-700">
                        <DocumentArrowDownIcon className="w-4 h-4" /> Export Statement
                     </button>
                     <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                        <PlusIcon className="w-4 h-4" /> Add Funds
                     </button>
                </div>
            </div>

            {/* Financial KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Current Balance', value: '$15,120.00', sub: 'Due Dec 15', icon: BanknotesIcon, color: 'text-amber-400' },
                    { label: 'Last Invoice', value: '$13,800.00', sub: 'Paid on Nov 01', icon: DocumentCheckIcon, color: 'text-emerald-400' },
                    { label: 'YTD Spend', value: '$142,500.00', sub: '+12% vs 2023', icon: ChartPieIcon, color: 'text-blue-400' },
                    { label: 'Projected Spend', value: '$16,200.00', sub: 'For Jan 2025', icon: ArrowTrendingUpIcon, color: 'text-indigo-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-100">{stat.value}</h4>
                            <p className="text-[10px] font-medium text-slate-500 mt-1">{stat.sub}</p>
                        </div>
                        {/* Background Decoration */}
                        <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-3xl opacity-10 ${stat.color.replace('text-', 'bg-')}`}></div>
                    </div>
                ))}
            </div>

            {/* Main Spend Trend Chart */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-80 flex flex-col">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <ArrowTrendingUpIcon className="w-5 h-5 text-indigo-400" /> Cost Evolution
                    </h3>
                    <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                        <button className="px-3 py-1 rounded text-[10px] font-bold bg-slate-800 text-white shadow-sm">Daily</button>
                        <button className="px-3 py-1 rounded text-[10px] font-bold text-slate-500 hover:text-slate-300">Monthly</button>
                    </div>
                 </div>
                 <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_DATA.SpendTrend}>
                            <defs>
                                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}
                                labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
            </div>

            {/* Bottom Row: Invoices & Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Invoice History */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                            <ClipboardDocumentCheckIcon className="w-5 h-5 text-slate-400" /> Invoice History
                        </h3>
                        <button className="text-[10px] text-blue-400 hover:text-blue-300 font-bold">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-800/50 text-slate-500 uppercase font-bold tracking-widest text-[9px]">
                                <tr>
                                    <th className="px-6 py-3">Invoice ID</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Items</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Download</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {MOCK_DATA.Invoices.map(inv => (
                                    <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-slate-300">{inv.id}</td>
                                        <td className="px-6 py-4 text-slate-400">{inv.date}</td>
                                        <td className="px-6 py-4 text-slate-400">{inv.items} items</td>
                                        <td className="px-6 py-4 font-bold text-slate-200">{inv.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                                                inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1.5 hover:bg-slate-700 rounded text-slate-500 hover:text-white transition-colors">
                                                <ArrowDownTrayIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Cost Allocation & Payment Method */}
                <div className="space-y-6">
                    {/* Pie Chart */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col h-[300px]">
                        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <ReceiptPercentIcon className="w-5 h-5 text-purple-400" /> Cost Allocation
                        </h3>
                        <div className="flex-1 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={MOCK_DATA.CostBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {MOCK_DATA.CostBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xl font-extrabold text-white">$15.1k</span>
                                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Total</span>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            {MOCK_DATA.CostBreakdown.map(item => (
                                <div key={item.name} className="flex items-center justify-between text-[10px]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-slate-400">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-slate-200">${item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-700">
                                <CreditCardIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Active</span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono tracking-widest mb-1">**** **** **** 4242</p>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[9px] text-slate-500 uppercase font-bold">Expires</p>
                                <p className="text-xs text-slate-200">12/28</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] text-slate-500 uppercase font-bold">Card Holder</p>
                                <p className="text-xs text-slate-200">Alex Rivers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

// --- View: Processes View (Kanban Style) ---
const ProcessesView = () => {
    const [selectedProcessId, setSelectedProcessId] = useState(MOCK_DATA.Processes[0].id);
    const process = MOCK_DATA.Processes.find(p => p.id === selectedProcessId) || MOCK_DATA.Processes[0];

    return (
        <main className="flex-1 flex overflow-hidden bg-slate-950 animate-in fade-in duration-500">
            {/* Sidebar Process List */}
            <aside className="w-72 bg-slate-900/10 border-r border-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                        <Square3Stack3DIcon className="w-6 h-6 text-blue-500" /> Processes
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Workflow Catalog</p>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {MOCK_DATA.Processes.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setSelectedProcessId(p.id)}
                            className={`w-full text-left p-3 rounded-xl border transition-all ${
                                selectedProcessId === p.id 
                                ? 'bg-blue-600/10 border-blue-500/30 ring-1 ring-blue-500/20' 
                                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`text-sm font-bold ${selectedProcessId === p.id ? 'text-blue-400' : 'text-slate-200'}`}>{p.name}</h3>
                                {p.health < 90 && <ExclamationTriangleIcon className="w-4 h-4 text-amber-500" />}
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                                <span>{p.activeCount} Active</span>
                                <span>Avg: {p.avgCompletionTime}</span>
                            </div>
                            <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full ${p.health > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${p.health}%` }}></div>
                            </div>
                        </button>
                    ))}
                    <button className="w-full p-3 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs font-bold hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2">
                        <PlusIcon className="w-4 h-4" /> New Process Definition
                    </button>
                </div>
            </aside>

            {/* Main Kanban Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0c]">
                {/* Board Header */}
                <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-bold text-white">{process.name}</h3>
                        <div className="flex items-center gap-2 px-2 py-1 bg-slate-800 rounded-lg border border-slate-700">
                             <div className={`w-2 h-2 rounded-full ${process.health > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                             <span className="text-xs font-mono text-slate-300">Health: {process.health}%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {['AR','SJ','MR'].map((u,i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[9px] font-bold text-slate-300">{u}</div>
                            ))}
                            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-900 flex items-center justify-center text-[9px] font-bold text-slate-500">+4</div>
                        </div>
                        <div className="h-6 w-px bg-slate-800"></div>
                        <button className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"><AdjustmentsHorizontalIcon className="w-4 h-4" /></button>
                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20">Create Instance</button>
                    </div>
                </div>

                {/* Kanban Columns */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                    <div className="flex h-full gap-6">
                        {process.stages.map(stage => {
                            const stageInstances = process.instances.filter(i => i.stageId === stage.id);
                            return (
                                <div key={stage.id} className="w-80 flex-shrink-0 flex flex-col h-full rounded-2xl bg-slate-900/20 border border-slate-800/50">
                                    {/* Column Header */}
                                    <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                                            <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">{stage.name}</span>
                                        </div>
                                        <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold">{stageInstances.length}</span>
                                    </div>
                                    
                                    {/* Cards Container */}
                                    <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
                                        {stageInstances.map(instance => (
                                            <div key={instance.id} className="bg-slate-800/40 hover:bg-slate-800/80 p-4 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-all group cursor-grab active:cursor-grabbing shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                                        instance.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                                                        instance.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                                                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                                    }`}>
                                                        {instance.priority}
                                                    </span>
                                                    <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"><Cog6ToothIcon className="w-3.5 h-3.5" /></button>
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-200 mb-3 leading-tight">{instance.title}</h4>
                                                
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-bold text-white border border-slate-600">{instance.avatar}</div>
                                                        <span className="text-[10px] text-slate-400">{instance.owner}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] font-mono font-medium text-slate-500">
                                                        <ClockIcon className="w-3 h-3" />
                                                        <span className={instance.timeInStage.includes('d') ? 'text-amber-400' : ''}>{instance.timeInStage}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Empty State / Add Placeholder */}
                                        <button className="w-full py-3 border border-dashed border-slate-800 rounded-xl text-slate-600 text-xs font-bold hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all opacity-0 group-hover:opacity-100">
                                            + Add Item
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
};

// --- View: Projects View ---
const ProjectsView = () => {
    const [filter, setFilter] = useState<'All' | 'Active' | 'Completed' | 'At Risk'>('Active');

    const filteredProjects = MOCK_DATA.Projects.filter(p => {
        if (filter === 'All') return true;
        if (filter === 'Active') return p.status !== 'Completed';
        if (filter === 'Completed') return p.status === 'Completed';
        if (filter === 'At Risk') return p.risk === 'High';
        return true;
    });

    return (
        <main className="flex-1 overflow-y-auto bg-slate-950 p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <BriefcaseIcon className="w-8 h-8 text-blue-500" /> Project Portfolio
                    </h2>
                    <p className="text-slate-400 mt-2 font-medium">
                        Strategic initiative tracking. Monitor budgets, timelines, and risk factors across the organization.
                    </p>
                </div>
                <div className="flex gap-2">
                     <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                        <PlusIcon className="w-4 h-4" /> New Initiative
                     </button>
                </div>
            </div>

            {/* Portfolio Summary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                    { label: 'Total Active', value: '12', sub: '3 High Risk', icon: BriefcaseIcon },
                    { label: 'Budget Utilized', value: '$1.4M', sub: '68% of Total', icon: BanknotesIcon },
                    { label: 'Avg Progress', value: '45%', sub: '+5% this week', icon: ChartPieIcon },
                    { label: 'Upcoming Deadlines', value: '4', sub: 'Next 30 Days', icon: CalendarDaysIcon }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                            <h4 className="text-xl font-bold text-slate-200">{stat.value}</h4>
                            <p className="text-[10px] text-slate-500">{stat.sub}</p>
                        </div>
                        <stat.icon className="w-8 h-8 text-slate-700 stroke-1" />
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 p-1.5 rounded-xl w-fit">
                {['All', 'Active', 'At Risk', 'Completed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            filter === f ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                    <div key={project.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all group flex flex-col h-full relative overflow-hidden">
                         {/* Risk Indicator */}
                         <div className={`absolute top-0 right-0 w-16 h-16 opacity-10 pointer-events-none rounded-bl-full ${
                             project.risk === 'High' ? 'bg-rose-500' :
                             project.risk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                         }`}></div>

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border mb-2 ${
                                    project.status === 'On Track' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    project.status === 'At Risk' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                    project.status === 'Delayed' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    project.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                }`}>
                                    {project.status}
                                </span>
                                <h3 className="text-lg font-bold text-slate-100 leading-tight">{project.name}</h3>
                            </div>
                        </div>

                        <p className="text-xs text-slate-400 mb-6 flex-1">{project.description}</p>

                        <div className="space-y-4 mb-6">
                            {/* Progress */}
                            <div>
                                <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-500">
                                    <span>Completion</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${
                                            project.status === 'Completed' ? 'bg-blue-500' :
                                            project.status === 'At Risk' ? 'bg-rose-500' : 'bg-emerald-500'
                                        }`} 
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Budget */}
                            <div>
                                <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-500">
                                    <span>Budget Used</span>
                                    <span>${(project.budget.used / 1000).toFixed(0)}k / ${(project.budget.total / 1000).toFixed(0)}k</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                                    <div 
                                        className="h-full bg-indigo-500 rounded-full"
                                        style={{ width: `${(project.budget.used / project.budget.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                             <div className="flex -space-x-2">
                                {project.team.map((u, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-300">{u}</div>
                                ))}
                             </div>
                             <div className="text-right">
                                 <p className="text-[9px] text-slate-500 font-bold uppercase">Next Milestone</p>
                                 <p className="text-[10px] font-mono text-slate-300">{project.nextMilestone}</p>
                             </div>
                        </div>
                    </div>
                ))}
                
                {/* Empty State Card */}
                <button className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-all mb-3">
                        <PlusIcon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-blue-400">Draft New Project</span>
                </button>
            </div>
        </main>
    );
};

// --- View: Automations View ---
const AutomationsView = () => {
    const [bots, setBots] = useState(MOCK_DATA.Bots);
    const [filter, setFilter] = useState<'All' | BotStatus>('All');

    const filteredBots = filter === 'All' ? bots : bots.filter(b => b.status === filter);

    const toggleBotStatus = (id: string) => {
        setBots(prev => prev.map(bot => {
            if (bot.id === id) {
                // Simple toggle logic for demo
                const newStatus = bot.status === 'Running' ? 'Paused' : 'Running';
                return { ...bot, status: newStatus };
            }
            return bot;
        }));
    };

    return (
        <main className="flex-1 overflow-y-auto bg-slate-950 p-8 space-y-8 animate-in fade-in duration-500">
             {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <CpuChipIcon className="w-8 h-8 text-blue-500" /> Automation Fleet
                    </h2>
                    <p className="text-slate-400 mt-2 font-medium">
                        Manage your robotic workforce. Monitor uptime, health, and task execution in real-time.
                    </p>
                </div>
                <div className="flex gap-2">
                     <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                        <PlusIcon className="w-4 h-4" /> Deploy New Bot
                     </button>
                </div>
            </div>

            {/* Automation KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Bots', value: '48', sub: '6 Idle', icon: ServerIcon },
                    { label: 'Tasks / 24h', value: '14.2k', sub: '+12%', icon: CheckCircleIcon },
                    { label: 'Error Rate', value: '0.4%', sub: 'Within limits', icon: ExclamationTriangleIcon },
                    { label: 'Compute Usage', value: '42%', sub: '24 Cores Active', icon: BoltIcon }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                            <h4 className="text-xl font-bold text-slate-200">{stat.value}</h4>
                            <p className="text-[10px] text-slate-500">{stat.sub}</p>
                        </div>
                        <stat.icon className="w-8 h-8 text-slate-700 stroke-1" />
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 p-1.5 rounded-xl w-fit">
                {['All', 'Running', 'Idle', 'Error', 'Paused'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            filter === f ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Bot Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBots.map(bot => (
                    <div key={bot.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
                        {/* Status Indicator Line */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${
                            bot.status === 'Running' ? 'bg-emerald-500' :
                            bot.status === 'Error' ? 'bg-rose-500' :
                            bot.status === 'Idle' ? 'bg-slate-500' :
                            bot.status === 'Maintenance' ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                                    <CpuChipIcon className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-200">{bot.name}</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{bot.type}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                bot.status === 'Running' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                bot.status === 'Error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                bot.status === 'Idle' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                                bot.status === 'Maintenance' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            }`}>
                                {bot.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                             <div>
                                 <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Uptime</p>
                                 <p className="text-xs font-mono font-bold text-slate-300">{bot.uptime}</p>
                             </div>
                             <div>
                                 <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Success Rate</p>
                                 <p className={`text-xs font-mono font-bold ${bot.successRate < 90 ? 'text-rose-400' : 'text-emerald-400'}`}>{bot.successRate}%</p>
                             </div>
                             <div>
                                 <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Processed</p>
                                 <p className="text-xs font-mono font-bold text-slate-300">{bot.tasksProcessed.toLocaleString()}</p>
                             </div>
                             <div>
                                 <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Next Run</p>
                                 <p className="text-xs font-mono font-bold text-slate-300">{bot.nextRun}</p>
                             </div>
                        </div>

                        {/* Health Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-[9px] mb-1 font-bold text-slate-500">
                                <span>Health</span>
                                <span>{bot.successRate}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${bot.successRate < 90 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                    style={{ width: `${bot.successRate}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                            {bot.status === 'Running' ? (
                                <button onClick={() => toggleBotStatus(bot.id)} className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition-colors border border-slate-700">
                                    <PauseIcon className="w-3 h-3" /> Pause
                                </button>
                            ) : (
                                <button onClick={() => toggleBotStatus(bot.id)} className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] font-bold text-emerald-400 transition-colors border border-emerald-500/20">
                                    <PlayIcon className="w-3 h-3" /> Resume
                                </button>
                            )}
                            <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700" title="Logs">
                                <CommandLineIcon className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700" title="Settings">
                                <Cog6ToothIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                
                {/* Add New Bot Placeholder */}
                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all min-h-[300px]">
                  <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 mb-4 group-hover:scale-110 group-hover:text-blue-400 transition-all border border-slate-700 shadow-lg">
                      <PlusIcon className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-400 group-hover:text-blue-400">Deploy New Bot</h4>
                  <p className="text-[10px] text-slate-600 mt-2 max-w-[150px]">Select from templates or build a custom agent.</p>
                </div>
            </div>
        </main>
    );
};

// --- View: Integrations Hub ---

const IntegrationsHub = ({ role }: { role: UserRole }) => {
  const [filter, setFilter] = useState('All');
  const [integrations, setIntegrations] = useState(MOCK_DATA.Integrations);
  
  const isAdmin = role === 'Executive' || role === 'IT';
  const categories = ['All', 'Accounting', 'CRM', 'Identity', 'Communication'];
  
  const toggleConnection = (id: string) => {
      setIntegrations(prev => prev.map(i => {
          if (i.id === id) {
              return { ...i, status: i.status === 'Connected' ? 'Not Connected' : 'Connected', lastSync: i.status === 'Connected' ? 'N/A' : 'Just now' };
          }
          return i;
      }));
  };

  const filtered = filter === 'All' ? integrations : integrations.filter(i => i.category === filter);

  return (
    <main className="flex-1 overflow-y-auto p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-950">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
             <LinkIcon className="w-8 h-8 text-blue-500" /> Integrations Hub
          </h2>
          <p className="text-slate-400 mt-2 font-medium">
            Transform AIISTECH into your central operational hub. Automate project workflows, sync accounting data, and centralize identity management.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
           {categories.map(cat => (
             <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MOCK_DATA.IntegrationKPIs.map(kpi => (
          <div key={kpi.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{kpi.label}</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-white">{kpi.value}</h3>
              <div className={`text-[10px] font-bold ${kpi.trend === 'up' ? 'text-emerald-400' : 'text-slate-400'}`}>{kpi.delta}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(app => (
          <div key={app.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col min-h-[220px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="flex items-start justify-between mb-5 relative z-10">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-slate-700 group-hover:scale-110 transition-transform">{app.icon}</div>
              <div className="flex flex-col items-end">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                  app.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  app.status === 'Degraded' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  app.status === 'Error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {app.status}
                </span>
                <span className="text-[9px] font-mono text-slate-600 mt-1">{app.lastSync !== 'N/A' ? `Synced ${app.lastSync}` : 'Offline'}</span>
              </div>
            </div>

            <div className="flex-1 relative z-10">
              <h4 className="text-sm font-bold text-slate-100">{app.name}</h4>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">{app.category}</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{app.valueProp}</p>
            </div>

            <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between mt-auto">
              {app.status === 'Not Connected' ? (
                <button 
                    disabled={!isAdmin} 
                    onClick={() => toggleConnection(app.id)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50"
                >
                    Setup Connection
                </button>
              ) : (
                <>
                  <button className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-1.5"><Cog6ToothIcon className="w-4 h-4" /> Settings</button>
                  <button 
                    onClick={() => toggleConnection(app.id)}
                    className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 font-mono tracking-tighter uppercase"
                  >
                      Disconnect
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        
        <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 mb-3 group-hover:scale-110 group-hover:text-blue-400 transition-all border border-slate-700"><PlusIcon className="w-6 h-6" /></div>
          <h4 className="text-xs font-bold text-slate-500 group-hover:text-blue-400">Request Custom Connector</h4>
        </div>
      </section>
    </main>
  );
};

// --- Settings Section Components ---
// (Kept as previously defined, mostly static for this revision)
const WorkspaceSection = ({ isAdmin }: { isAdmin: boolean }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2"><GlobeAltIcon className="w-5 h-5 text-blue-400" /> Basic Information</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Workspace Name</label>
            <input disabled={!isAdmin} type="text" defaultValue="AIISTECH Alpha" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Primary Contact</label>
            <input disabled={!isAdmin} type="text" defaultValue="Alex Rivers" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50" />
          </div>
          {/* ... more fields ... */}
        </div>
      </div>
      {/* ... Display Preferences ... */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Display Preferences</h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-slate-200">Appearance Mode</p>
                   <p className="text-[10px] text-slate-500">Switch between dark and light themes.</p>
                </div>
                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                   <button className="p-1.5 bg-slate-700 rounded shadow-inner"><MoonIcon className="w-4 h-4 text-blue-400" /></button>
                   <button className="p-1.5 hover:bg-slate-700 transition-colors rounded"><SunIcon className="w-4 h-4 text-slate-500" /></button>
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Default View Role</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none">
                  <option>Executive</option>
                  <option>Operations</option>
                  <option>Finance</option>
                  <option>IT</option>
                </select>
             </div>
          </div>
        </div>
    </div>
    {isAdmin && (
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95">Save Changes</button>
      </div>
    )}
  </div>
);

const UsersSection = ({ isAdmin }: { isAdmin: boolean }) => (
    <div className="space-y-6 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200">Active Members</h3>
          {isAdmin && (
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-all">
              <PlusIcon className="w-3.5 h-3.5" /> Invite User
            </button>
          )}
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800 text-slate-500 uppercase font-bold tracking-widest text-[9px]">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4">Status</th>
              {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {MOCK_DATA.TeamUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-200 border border-slate-600">{user.avatar}</div>
                  <div>
                    <p className="font-bold text-slate-200">{user.name}</p>
                    <p className="text-[10px] text-slate-500">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${user.role === 'Executive' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{user.role}</span>
                </td>
                <td className="px-6 py-4 text-slate-500">{user.lastActive}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-500'}`}></div>
                    <span className="text-slate-400">{user.status}</span>
                  </div>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-slate-700 rounded text-slate-500 hover:text-white transition-colors"><Cog6ToothIcon className="w-4 h-4" /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ... Role Definitions ... */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Role Definitions</h3>
        <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider font-bold">Permissions Overview</p>
        <div className="space-y-4">
          {MOCK_DATA.Roles.map(role => (
            <div key={role.name} className="p-3 bg-slate-800/40 rounded-lg border border-slate-800">
               <p className="text-xs font-bold text-blue-400 mb-1">{role.name}</p>
               <p className="text-[10px] text-slate-400 leading-normal">{role.access}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const BillingSettings = ({ isAdmin }: { isAdmin: boolean }) => (
    <div className="space-y-6 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-8">
          <div className="flex items-center justify-between">
             <h3 className="text-sm font-bold text-slate-200">Plan Summary</h3>
             <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20 uppercase tracking-widest">{MOCK_DATA.Subscription.plan}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {MOCK_DATA.Subscription.limits.map(limit => (
               <div key={limit.label} className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">{limit.label}</span>
                    <span className="text-slate-200">{limit.used} / {limit.total}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }}></div>
                  </div>
               </div>
             ))}
          </div>
          <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 flex items-center justify-between">
             <div>
                <p className="text-xs font-bold text-slate-200">Next Renewal Date</p>
                <p className="text-[10px] text-slate-500">{MOCK_DATA.Subscription.renewalDate} (Annual Cycle)</p>
             </div>
             <button disabled={!isAdmin} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-lg transition-all disabled:opacity-50">View Detailed Billing</button>
          </div>
       </div>

       <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-200">Billing Contact</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500">Invoice Recipient</label>
              <p className="text-sm font-bold text-slate-200">{MOCK_DATA.Subscription.billingContact}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500">Billing Email</label>
              <p className="text-sm font-bold text-slate-200">{MOCK_DATA.Subscription.billingEmail}</p>
            </div>
            <div className="pt-4 border-t border-slate-800">
               <button disabled={!isAdmin} className="w-full py-2 border border-slate-700 hover:border-slate-500 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all disabled:opacity-50">Update Billing Details</button>
            </div>
          </div>
       </div>
    </div>
  </div>
);

const NotificationsSection = () => (
  <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden animate-in fade-in duration-500">
    <div className="px-6 py-4 border-b border-slate-800">
      <h3 className="text-sm font-bold text-slate-200">Notification Channels</h3>
      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Email & In-App Preferences</p>
    </div>
    <div className="divide-y divide-slate-800">
      {[
        { label: 'Automation Failures', desc: 'Real-time alerts for bot errors or timeouts.', role: 'Ops / IT' },
        { label: 'Billing Events', desc: 'New invoices and usage threshold notifications.', role: 'Finance / Exec' },
        { label: 'Compliance Reports', desc: 'Policy change summaries and weekly audit logs.', role: 'IT / Exec' },
        { label: 'Workspace Announcements', desc: 'Platform updates and system maintenance news.', role: 'All Roles' },
      ].map(item => (
        <div key={item.label} className="p-6 flex items-center justify-between hover:bg-slate-800/10 transition-colors">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
               <p className="text-sm font-bold text-slate-200">{item.label}</p>
               <span className="text-[9px] font-bold text-blue-500/80 uppercase tracking-tighter">[{item.role}]</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-center gap-1">
                <p className="text-[8px] font-bold text-slate-600 uppercase">Email</p>
                <div className="w-9 h-5 bg-blue-600 rounded-full relative shadow-inner"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
             </div>
             <div className="flex flex-col items-center gap-1">
                <p className="text-[8px] font-bold text-slate-600 uppercase">In-App</p>
                <div className="w-9 h-5 bg-slate-700 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
             </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PrivacySection = ({ isAdmin }: { isAdmin: boolean }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-6">
      <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2"><PrivacyIcon className="w-5 h-5 text-emerald-400" /> Data & Privacy Policies</h3>
      <div className="space-y-6">
         <div className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl">
            <h4 className="text-xs font-bold text-slate-200 mb-2">Tenant Retention Policy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Automation logs are stored for <span className="text-emerald-400 font-bold">90 days</span>. Financial snapshots are retained for <span className="text-emerald-400 font-bold">7 years</span> in compliance with SOC2 standards. Manual archives can be requested via the DPO.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-800 rounded-xl space-y-3">
               <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Compliance Officer</h4>
               <p className="text-xs font-medium text-slate-400 italic">Dmitri Kozlov (DPO)</p>
               <p className="text-[10px] font-mono text-slate-600">compliance@aiistech.com</p>
            </div>
            <div className="p-4 border border-slate-800 rounded-xl flex flex-col justify-center gap-3">
               <button disabled={!isAdmin} className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-200 transition-all disabled:opacity-50">
                  Request Data Export <ArrowDownTrayIcon className="w-4 h-4 text-slate-500" />
               </button>
               <button disabled={!isAdmin} className="w-full flex items-center justify-between px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-xs font-bold text-rose-400 transition-all disabled:opacity-50">
                  Initiate Deletion <ShieldExclamationIcon className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
    </div>
  </div>
);

// --- Main Sidebar Component ---

const Sidebar = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (t: string) => void }) => {
  const items = [
    { id: 'Dashboard', icon: HomeIcon },
    { id: 'Automations', icon: CpuChipIcon },
    { id: 'Processes', icon: Square3Stack3DIcon },
    { id: 'Projects', icon: BriefcaseIcon },
    { id: 'Billing', icon: BanknotesIcon },
    { id: 'Integrations', icon: LinkIcon }, 
    { id: 'Compliance Audit', icon: ShieldCheckIcon },
    { id: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 flex flex-col h-full bg-slate-900/50 backdrop-blur-xl shrink-0">
      <div className="p-6"><Logo /></div>
      <nav className="flex-1 px-4 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === item.id 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.id}
          </button>
        ))}
      </nav>
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 bg-slate-800/30 p-2 rounded-xl border border-slate-800">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-200 border border-slate-600">AR</div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate text-slate-200">Alex Rivers</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Workspace Owner</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

// --- View: Settings (First-Class Refactor) ---

const SettingsView = ({ role }: { role: UserRole }) => {
  const [activeSubTab, setActiveSubTab] = useState('Workspace');
  const isAdmin = role === 'Executive' || role === 'IT';

  const subTabs = [
    { id: 'Workspace', icon: GlobeAltIcon },
    { id: 'Users & Roles', icon: UsersIcon },
    { id: 'Billing & Subscription', icon: BillingIcon },
    { id: 'Notifications', icon: BellIcon },
    { id: 'Data & Privacy', icon: PrivacyIcon },
  ];

  const renderSubContent = () => {
    switch (activeSubTab) {
      case 'Workspace': return <WorkspaceSection isAdmin={isAdmin} />;
      case 'Users & Roles': return <UsersSection isAdmin={isAdmin} />;
      case 'Billing & Subscription': return <BillingSettings isAdmin={isAdmin} />;
      case 'Notifications': return <NotificationsSection />;
      case 'Data & Privacy': return <PrivacySection isAdmin={isAdmin} />;
      default: return <WorkspaceSection isAdmin={isAdmin} />;
    }
  };

  return (
    <main className="flex-1 overflow-hidden flex flex-col h-full bg-slate-950 animate-in fade-in duration-700">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r border-slate-800 bg-slate-900/10 py-6 px-4 shrink-0 flex flex-col overflow-y-auto">
          <div className="mb-8 px-4">
             <h2 className="text-xl font-extrabold text-white tracking-tight">Settings</h2>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Tenant Management</p>
          </div>
          <nav className="space-y-1 flex-1">
            {subTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                  activeSubTab === tab.id 
                    ? 'bg-blue-600/10 text-blue-400 border-blue-500/20 shadow-md' 
                    : 'text-slate-500 hover:text-slate-200 border-transparent hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.id}
              </button>
            ))}
          </nav>
          
          <div className="pt-6 border-t border-slate-800 px-4">
             <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Authorization</p>
                <p className={`text-[10px] font-bold ${isAdmin ? 'text-emerald-400' : 'text-amber-400'}`}>
                   {isAdmin ? 'Administrative Access' : 'Restricted Access'}
                </p>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0c]">
           <div className="max-w-4xl mx-auto pb-20">
              <header className="mb-8 border-b border-slate-800 pb-6">
                 <h3 className="text-2xl font-bold text-white tracking-tight">{activeSubTab}</h3>
                 <p className="text-sm text-slate-500 mt-1">Manage your workspace's {activeSubTab.toLowerCase()} settings and preferences.</p>
              </header>
              {renderSubContent()}
           </div>
        </div>
      </div>
    </main>
  );
};

// --- View: Dashboard ---
const Dashboard = ({ role, dateRange }: { role: UserRole, dateRange: DateRange }) => {
  const metrics = MOCK_DATA.KPI[role];
  const [activities, setActivities] = useState<ActivityLog[]>(MOCK_DATA.RecentActivity);
  
  // Memoize sparkline data so it doesn't jitter on re-renders (like live feed updates)
  const sparklines = useMemo(() => {
    return metrics.map(m => ({
        id: m.id,
        data: Array.from({ length: 10 }, (_, i) => ({
             i,
             val: m.trend === 'up' ? 50 + i * 5 + Math.random() * 10 : 
                  m.trend === 'down' ? 100 - i * 5 + Math.random() * 10 : 
                  50 + Math.random() * 20
        }))
    }));
  }, [metrics]);

  // Reactive Data for Main Chart
  const chartData = useMemo(() => {
    if (dateRange === 'Today') return MOCK_DATA.Trends.Hourly;
    if (dateRange === '7d') return MOCK_DATA.Trends.Daily;
    return MOCK_DATA.Trends.Monthly;
  }, [dateRange]);

  // Live Feed Simulation
  useEffect(() => {
    const interval = setInterval(() => {
        setActivities(prev => {
            const newLog = generateRandomLog(Date.now());
            return [newLog, ...prev].slice(0, 8); // Keep last 8 items
        });
    }, 4000); // Update every 4s
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex-1 overflow-y-auto bg-slate-950 p-8 space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                    <ChartPieIcon className="w-8 h-8 text-blue-500" /> Command Center
                </h2>
                <p className="text-slate-400 mt-2 font-medium">
                    Operational oversight and performance metrics for {role} role.
                </p>
            </div>
             <div className="flex gap-2">
                 <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                    <ArrowDownTrayIcon className="w-4 h-4" /> Export Report
                 </button>
             </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m, idx) => (
                <KpiCard key={m.id} metric={m} sparkData={sparklines[idx].data} />
            ))}
        </div>

        {/* Primary Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Financial Impact / Main Trend */}
            <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                            <BanknotesIcon className="w-5 h-5 text-emerald-400" /> Financial Impact Analysis
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Cost Savings vs. Revenue ({dateRange})</p>
                    </div>
                    <div className="flex gap-2">
                         <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/50 border border-slate-700">
                             <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                             <span className="text-[10px] text-slate-400 font-bold">Revenue</span>
                         </div>
                         <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/50 border border-slate-700">
                             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                             <span className="text-[10px] text-slate-400 font-bold">Savings</span>
                         </div>
                    </div>
                </div>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val > 1000 ? val/1000 + 'k' : val}`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={1000} />
                            <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" animationDuration={1000} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bot Health Distribution */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col">
                <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <CpuChipIcon className="w-5 h-5 text-indigo-400" /> Bot Fleet Status
                </h3>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">Real-time Utilization</p>
                
                <div className="flex-1 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={MOCK_DATA.BotPerformance}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {MOCK_DATA.BotPerformance.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-extrabold text-white">59</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total Bots</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {MOCK_DATA.BotPerformance.map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-2 rounded bg-slate-800/30 border border-slate-800/50">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-[10px] font-bold text-slate-300">{item.name}</span>
                            </div>
                            <span className="text-xs font-bold text-white">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Secondary Row: Efficiency & Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Efficiency Chart */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-80 flex flex-col">
                 <h3 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-2">
                    <BoltIcon className="w-5 h-5 text-amber-400" /> Efficiency Gains by Department
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_DATA.DepartmentEfficiency} layout="vertical" margin={{ left: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                         <XAxis type="number" stroke="#64748b" fontSize={10} hide />
                         <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} fontWeight={600} width={60} tickLine={false} axisLine={false} />
                         <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                         <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                         <Bar dataKey="manual" name="Manual Hours" stackId="a" fill="#334155" radius={[0, 0, 0, 0]} barSize={20} />
                         <Bar dataKey="automated" name="Automated Hours" stackId="a" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Live Feed */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-80">
                 <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <CommandLineIcon className="w-5 h-5 text-slate-400" /> Live System Feed
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live</span>
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="divide-y divide-slate-800/50">
                        {activities.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="p-4 flex gap-4 hover:bg-slate-800/30 transition-all duration-500 animate-in slide-in-from-top-2 group">
                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                    item.status === 'success' ? 'bg-emerald-500' : 
                                    item.status === 'warn' ? 'bg-amber-500' : 
                                    item.status === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                                }`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">{item.message}</p>
                                    <p className="text-[10px] text-slate-500 mt-1 font-mono">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    </main>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [role, setRole] = useState<UserRole>('Executive');
  const [dateRange, setDateRange] = useState<DateRange>('7d');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <Dashboard role={role} dateRange={dateRange} />;
      case 'Automations': return <AutomationsView />;
      case 'Processes': return <ProcessesView />;
      case 'Projects': return <ProjectsView />;
      case 'Billing': return <BillingView />;
      case 'Integrations': return <IntegrationsHub role={role} />;
      case 'Compliance Audit': return <ComplianceView />;
      case 'Settings': return <SettingsView role={role} />;
      default: return (
        <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-sm animate-pulse">
          // {activeTab} view loading in Alpha context...
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-blue-500/30">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header role={role} setRole={setRole} dateRange={dateRange} setDateRange={setDateRange} />
        <div className="flex-1 overflow-hidden bg-slate-950">{renderContent()}</div>
      </div>
    </div>
  );
};

export default App;