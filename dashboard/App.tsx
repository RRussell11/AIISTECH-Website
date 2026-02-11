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
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts';

// --- Types ---
type UserRole = 'Executive' | 'Operations' | 'Finance' | 'IT';
type DateRange = 'Today' | '7d' | '30d' | 'Custom';
type Severity = 'success' | 'warn' | 'error';

interface KpiMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'neutral';
  unit: string;
  severity: Severity;
}

interface BotRow {
  id: string;
  name: string;
  process: string;
  status: 'Running' | 'Idle' | 'Error' | 'Maintenance';
  uptimePct: number;
  lastRun: string;
  errorCount: number;
  owner: string;
}

interface ProcessMetric {
  id: string;
  name: string;
  volume: number;
  avgCycleTime: string;
  successRate: number;
  savingsYtd: string;
  owner: string;
}

interface Alert {
  id: string;
  time: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  target: string;
}

// --- Mock Data ---
const MOCK_DATA = {
  KPI: {
    Executive: [
      { id: '1', label: 'Cost Savings YTD', value: '$1.2M', delta: '+12%', trend: 'up', unit: 'currency', severity: 'success' },
      { id: '2', label: 'Revenue (PSA)', value: '$4.8M', delta: '+5%', trend: 'up', unit: 'currency', severity: 'success' },
      { id: '3', label: 'Automation Rate', value: '68%', delta: '+3%', trend: 'up', unit: 'percent', severity: 'success' },
      { id: '4', label: 'Compliance Score', value: '94', delta: '-1', trend: 'down', unit: 'score', severity: 'warn' },
    ],
    Operations: [
      { id: '1', label: 'Bot Uptime', value: '99.8%', delta: '+0.1%', trend: 'up', unit: 'percent', severity: 'success' },
      { id: '2', label: 'FTE Hours Freed', value: '12,400', delta: '+800', trend: 'up', unit: 'hours', severity: 'success' },
      { id: '3', label: 'Automation Rate', value: '68%', delta: '+3%', trend: 'up', unit: 'percent', severity: 'success' },
      { id: '4', label: 'Error Rate', value: '1.2%', delta: '+0.4%', trend: 'up', unit: 'percent', severity: 'error' },
    ],
    Finance: [
      { id: '1', label: 'Cost Savings YTD', value: '$1.2M', delta: '+12%', trend: 'up', unit: 'currency', severity: 'success' },
      { id: '2', label: 'ROI (Projected)', value: '3.4x', delta: '+0.2', trend: 'up', unit: 'ratio', severity: 'success' },
      { id: '3', label: 'Revenue (PSA)', value: '$4.8M', delta: '+5%', trend: 'up', unit: 'currency', severity: 'success' },
      { id: '4', label: 'Billable Utilization', value: '82%', delta: '-2%', trend: 'down', unit: 'percent', severity: 'warn' },
    ],
    IT: [
      { id: '1', label: 'Bot Uptime', value: '99.8%', delta: '+0.1%', trend: 'up', unit: 'percent', severity: 'success' },
      { id: '2', label: 'System Health', value: 'Optimal', delta: 'Steady', trend: 'neutral', unit: 'text', severity: 'success' },
      { id: '3', label: 'Pending Updates', value: '12', delta: '+4', trend: 'up', unit: 'count', severity: 'warn' },
      { id: '4', label: 'Security Score', value: '98/100', delta: '0', trend: 'neutral', unit: 'score', severity: 'success' },
    ]
  },
  Trends: [
    { date: 'Jan', savings: 45000, automation: 45, errors: 2.1, cycleTime: 120 },
    { date: 'Feb', savings: 52000, automation: 48, errors: 1.8, cycleTime: 115 },
    { date: 'Mar', savings: 61000, automation: 52, errors: 1.5, cycleTime: 108 },
    { date: 'Apr', savings: 58000, automation: 55, errors: 1.9, cycleTime: 110 },
    { date: 'May', savings: 72000, automation: 60, errors: 1.2, cycleTime: 95 },
    { date: 'Jun', savings: 85000, automation: 65, errors: 1.1, cycleTime: 88 },
    { date: 'Jul', savings: 92000, automation: 68, errors: 1.2, cycleTime: 85 },
  ],
  Bots: [
    { id: 'b1', name: 'Invoice_Bot_01', process: 'AP Processing', status: 'Running', uptimePct: 99.9, lastRun: '2 mins ago', errorCount: 0, owner: 'Finance Ops' },
    { id: 'b2', name: 'HR_Onboarder', process: 'Employee Onboarding', status: 'Idle', uptimePct: 98.2, lastRun: '1 hour ago', errorCount: 2, owner: 'HR Tech' },
    { id: 'b3', name: 'Logistics_Sync', process: 'Inventory Sync', status: 'Error', uptimePct: 85.4, lastRun: 'Failed - 10m ago', errorCount: 14, owner: 'Supply Chain' },
    { id: 'b4', name: 'Email_Parser_v2', process: 'Client Support', status: 'Running', uptimePct: 99.5, lastRun: 'Just now', errorCount: 1, owner: 'Customer Success' },
  ],
  Processes: [
    { id: 'p1', name: 'AP Invoice Processing', volume: 12400, avgCycleTime: '4.2m', successRate: 98.5, savingsYtd: '$142k', owner: 'Sarah J.' },
    { id: 'p2', name: 'Lead Qualification', volume: 8500, avgCycleTime: '1.8m', successRate: 92.1, savingsYtd: '$88k', owner: 'Mike R.' },
    { id: 'p3', name: 'Compliance Auditing', volume: 450, avgCycleTime: '45m', successRate: 100, savingsYtd: '$210k', owner: 'Elena V.' },
  ],
  Alerts: [
    { id: 'a1', time: '10:42 AM', severity: 'HIGH', title: 'Bot Failure: Logistics_Sync', description: 'API Endpoint timeout detected in region US-EAST-1.', target: 'Bot' },
    { id: 'a2', time: '09:15 AM', severity: 'MEDIUM', title: 'Cycle Time Spiking', description: 'AP Processing average cycle time increased by 15%.', target: 'Process' },
    { id: 'a3', time: '08:00 AM', severity: 'LOW', title: 'Scheduled Maintenance', description: 'Database cluster maintenance scheduled for 11:00 PM.', target: 'System' },
  ]
};

// --- Components ---

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 relative flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-fuchsia-500 rounded-lg blur-sm opacity-50"></div>
      <div className="relative z-10 w-full h-full text-white">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
    <span className="font-extrabold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-fuchsia-400">
      AIISTECH
    </span>
  </div>
);

const Sidebar = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (t: string) => void }) => {
  const items = [
    { id: 'Dashboard', icon: HomeIcon },
    { id: 'Automations', icon: CpuChipIcon },
    { id: 'Processes', icon: Square3Stack3DIcon },
    { id: 'Projects & Billing', icon: BanknotesIcon },
    { id: 'Compliance & Audit', icon: ShieldCheckIcon },
    { id: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 flex flex-col h-full bg-slate-900/50 backdrop-blur-xl shrink-0">
      <div className="p-6">
        <Logo />
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === item.id 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.id}
          </button>
        ))}
      </nav>
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <UserCircleIcon className="w-10 h-10 text-slate-500" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate text-slate-200">Alex Rivers</p>
            <p className="text-xs text-slate-500 truncate">Workspace Owner</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Header = ({ 
  role, setRole, 
  dateRange, setDateRange 
}: { 
  role: UserRole, setRole: (r: UserRole) => void,
  dateRange: DateRange, setDateRange: (d: DateRange) => void
}) => {
  const roles: UserRole[] = ['Executive', 'Operations', 'Finance', 'IT'];
  const ranges: DateRange[] = ['Today', '7d', '30d', 'Custom'];

  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
          <span className="text-xs font-semibold text-slate-300">Workspace Alpha</span>
          <ChevronDownIcon className="w-3 h-3 text-slate-500" />
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
          Production
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-lg">
        {ranges.map(range => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              dateRange === range ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
          <span className="text-xs text-slate-500 font-mono">Role:</span>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="bg-transparent text-xs font-bold text-slate-200 outline-none cursor-pointer appearance-none pr-4"
          >
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDownIcon className="absolute right-3 w-3 h-3 text-slate-500 pointer-events-none" />
        </div>
        <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
        </button>
        <button className="p-2 text-slate-400 hover:text-white transition-colors">
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

// Fixed KpiCard to use React.FC to handle special 'key' prop when used in maps
const KpiCard: React.FC<{ metric: KpiMetric }> = ({ metric }) => {
  const severityColors = {
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    warn: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    error: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">
          {metric.label}
        </span>
        <div className={`px-2 py-1 rounded text-[10px] font-bold border ${severityColors[metric.severity]}`}>
          {metric.trend === 'up' ? '▲' : metric.trend === 'down' ? '▼' : '●'} {metric.delta}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-white tracking-tight">{metric.value}</h3>
      </div>
    </div>
  );
};

const Dashboard = ({ role, dateRange }: { role: UserRole, dateRange: DateRange }) => {
  const kpis = useMemo(() => MOCK_DATA.KPI[role], [role]);

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-8">
      {/* Row 1 - KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => <KpiCard key={kpi.id} metric={kpi as KpiMetric} />)}
      </section>

      {/* Row 2 - Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-200">Cost Savings over Time</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <ArrowTrendingUpIcon className="w-3 h-3" />
              +18.4%
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_DATA.Trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#38bdf8" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-200">Processes Automated by Month</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Target: 70%</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA.Trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Bar dataKey="automation" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Row 3 - Tables */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Active Automations / Bots</h3>
            <button className="text-xs font-bold text-blue-400 hover:text-blue-300">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-3">Bot Name</th>
                  <th className="px-6 py-3">Process</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Uptime</th>
                  <th className="px-6 py-3 text-right">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {MOCK_DATA.Bots.map(bot => (
                  <tr key={bot.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-200">{bot.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Last run: {bot.lastRun}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{bot.process}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          bot.status === 'Running' ? 'bg-emerald-500 animate-pulse' : 
                          bot.status === 'Error' ? 'bg-rose-500' : 'bg-slate-500'
                        }`}></div>
                        <span className="text-xs font-medium text-slate-300">{bot.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-right font-mono text-slate-300">{bot.uptimePct}%</td>
                    <td className="px-6 py-4 text-xs text-right text-rose-400 font-bold">{bot.errorCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-200 mb-6">Security & Compliance Score</h3>
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-40 h-40">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: 94 }, { value: 6 }]}
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell fill="#38bdf8" />
                      <Cell fill="#1e293b" />
                    </Pie>
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">94</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Score</span>
               </div>
            </div>
            
            <div className="w-full space-y-3">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-300">HIPAA Compliant</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-300">SOC2 Type II</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-300">GDPR Renewals</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">14 Days</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Row 4 - Alerts */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-200">Real-time Alerts Feed</h3>
          </div>
          <div className="flex gap-2">
            {['HIGH', 'MEDIUM', 'LOW'].map(sev => (
              <button key={sev} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-widest">
                {sev}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-800">
          {MOCK_DATA.Alerts.map(alert => (
            <div key={alert.id} className="p-6 flex items-start gap-4 hover:bg-slate-800/30 transition-colors">
              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                alert.severity === 'HIGH' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                alert.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-slate-500'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-slate-200">{alert.title}</h4>
                  <span className="text-[10px] font-mono text-slate-500">{alert.time}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{alert.description}</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest">
                    Target: {alert.target}
                  </span>
                  <button className="text-[10px] font-bold text-blue-400 hover:underline uppercase tracking-widest">Investigate</button>
                  <button className="text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest">Dismiss</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [role, setRole] = useState<UserRole>('Executive');
  const [dateRange, setDateRange] = useState<DateRange>('7d');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          role={role} 
          setRole={setRole} 
          dateRange={dateRange} 
          setDateRange={setDateRange} 
        />
        <div className="flex-1 overflow-hidden">
          {activeTab === 'Dashboard' ? (
            <Dashboard role={role} dateRange={dateRange} />
          ) : (
            <div className="flex-1 flex items-center justify-center p-20 text-center">
              <div className="max-w-md">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700">
                   <CpuChipIcon className="w-8 h-8 text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{activeTab} View</h2>
                <p className="text-slate-400 text-sm">This section is currently under development as part of the Phase 2 implementation. Check back soon for deeper analytics and control features.</p>
                <button 
                  onClick={() => setActiveTab('Dashboard')}
                  className="mt-8 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors"
                >
                  Return to Command Center
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;