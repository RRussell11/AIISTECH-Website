import React, { useState, useEffect, useMemo } from 'react';
import { 
  Brain, 
  ArrowRight, 
  Check, 
  Users, 
  BarChart3, 
  Cpu, 
  Clock, 
  Layers, 
  Droplets, 
  CheckCircle2, 
  Menu, 
  X, 
  TrendingUp, 
  Target, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Stethoscope,
  Factory,
  Globe,
  Plus,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type Page = 'home' | 'solutions' | 'services' | 'pricing' | 'case-studies' | 'blog';

// --- UI Components ---

const Navbar = ({ activePage, setPage }: { activePage: Page, setPage: (p: Page) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; value: Page }[] = [
    { label: 'Platform', value: 'home' },
    { label: 'Solutions', value: 'solutions' },
    { label: 'Services', value: 'services' },
    { label: 'Pricing', value: 'pricing' },
    { label: 'Resources', value: 'blog' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark/95 backdrop-blur-md py-4 shadow-lg border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => { setPage('home'); window.scrollTo(0, 0); }}
        >
          <div className="relative">
            <Brain className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AIITech</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => { setPage(item.value); window.scrollTo(0, 0); }}
              className={`text-sm font-medium transition-colors hover:text-primary ${activePage === item.value ? 'text-primary' : 'text-slate-300'}`}
            >
              {item.label}
            </button>
          ))}
          <div className="h-4 w-[1px] bg-slate-700 mx-2"></div>
          <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</button>
          <button className="px-5 py-2.5 bg-primary text-dark font-bold rounded-lg text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            Start Assessment
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-dark border-b border-white/5 p-6 flex flex-col gap-6 md:hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => { setPage(item.value); setMobileMenu(false); window.scrollTo(0, 0); }}
                className={`text-lg font-medium text-left ${activePage === item.value ? 'text-primary' : 'text-slate-300'}`}
              >
                {item.label}
              </button>
            ))}
            <button className="w-full py-3 bg-primary text-dark font-bold rounded-lg hover:bg-primary/90 transition-all">
              Start Assessment
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeading = ({ title, subtitle, centered = false }: { title: string, subtitle?: string, centered?: boolean }) => (
  <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">{title}</h2>
    {subtitle && <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>}
    <div className={`w-16 h-1 bg-primary mt-6 ${centered ? 'mx-auto' : ''}`}></div>
  </div>
);

// --- Sub-Pages / Sections ---

const HomePage = ({ setPage }: { setPage: (p: Page) => void }) => {
  return (
    <div className="pt-20">
      {/* 1.1 Hero Section */}
      <section className="relative min-h-[90vh] bg-dark flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(56,189,248,0.15),transparent_50%)]"></div>
        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-6">
              <Zap size={14} /> The AI-Native PSA + Automation Stack
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
              Eliminate <span className="text-primary">Operational Friction</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
              Stop managing 8+ disconnected tools. Consolidate your PSA, automate your workflows, and eliminate manual work in one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex-1 max-w-md relative group">
                <input 
                  type="email" 
                  placeholder="Your work email" 
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 text-white outline-none focus:border-primary transition-all pr-12"
                />
                <button className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-dark font-bold rounded-lg hover:bg-primary/90 transition-all">
                  <ArrowRight size={20} />
                </button>
              </div>
              <button className="h-14 px-8 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                Watch Demo <Play size={16} className="fill-current" />
              </button>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 text-slate-500 text-sm">
              <div className="flex items-center gap-2"><Check size={16} className="text-primary" /> Free 30-min workshop</div>
              <div className="flex items-center gap-2"><Check size={16} className="text-primary" /> No credit card required</div>
              <div className="flex items-center gap-2"><Check size={16} className="text-primary" /> Vertical ROI models</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-transparent rounded-full border border-primary/5 p-12">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                 <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold">PS</div>
                      <div className="text-sm font-bold text-white">Project Dashboard</div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/5">
                        <div className={`w-2 h-10 rounded-full ${i === 1 ? 'bg-primary' : i === 2 ? 'bg-amber-400' : 'bg-slate-700'}`}></div>
                        <div className="flex-1">
                           <div className="h-4 w-2/3 bg-white/10 rounded mb-2"></div>
                           <div className="h-2 w-1/3 bg-white/5 rounded"></div>
                        </div>
                        <div className="text-xs font-mono text-slate-500">72%</div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-8 flex justify-center">
                    <div className="px-4 py-2 bg-primary/20 text-primary rounded-full text-xs font-bold border border-primary/30 flex items-center gap-2">
                       <Cpu size={14} /> AI AGENT ACTIVE
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-6 bg-dark border border-primary/30 rounded-2xl shadow-2xl">
                 <div className="text-xs text-slate-400 mb-1">PROFITABILITY IMPROVEMENT</div>
                 <div className="text-2xl font-bold text-primary">+34.8%</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 1.2 Problem Statement */}
      <section className="py-24 bg-dark">
        <div className="container mx-auto px-6">
          <SectionHeading 
            title="The Problem: Fragmentation" 
            subtitle="The typical services firm uses 8+ disconnected tools, resulting in revenue leakage and massive administrative overhead."
            centered
          />
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <Layers className="text-red-500" />, title: "Tool Fragmentation", desc: "Project management, time tracking, billing, and analytics living in 8 different silos." },
              { icon: <Droplets className="text-amber-500" />, title: "Revenue Leakage", desc: "30-40% of back-office time consumed by manual reconciliation and data entry." },
              { icon: <Clock className="text-blue-500" />, title: "Manual Deadlocks", desc: "Legacy RPA initiatives fail due to brittleness and inability to handle exceptions." },
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1.3 The Solution */}
      <section className="py-24 bg-accent text-white overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <SectionHeading title="The Solution: AI-Driven Stack" subtitle="A unified 3-part engine designed for the modern service enterprise." centered />
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-primary/20 hidden md:block -z-0"></div>
            
            {[
              { title: "AI-FIRST PSA", list: ["Projects & Tasks", "Time Tracking", "Unified Billing", "Predictive Analytics"], accent: "border-primary/40 bg-dark" },
              { title: "INTELLIGENT AUTOMATION", list: ["Agentic AI Bots", "Orchestration", "Document Processing", "Exception Handling"], accent: "border-white/10 bg-white/5" },
              { title: "RECURRING REVENUE", list: ["Managed Services", "Annuity Models", "Continuous Optimization", "Performance Guarantees"], accent: "border-primary/40 bg-dark" },
            ].map((card, idx) => (
              <div key={idx} className={`relative z-10 p-8 rounded-3xl border ${card.accent} shadow-2xl flex flex-col items-center text-center`}>
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold mb-6">{idx + 1}</div>
                <h3 className="text-2xl font-bold mb-8 tracking-tight">{card.title}</h3>
                <ul className="space-y-4 w-full">
                  {card.list.map((li, i) => (
                    <li key={i} className="text-slate-400 text-sm flex items-center justify-center gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full"></div> {li}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-20 p-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full opacity-30"></div>
          <div className="mt-8 text-center text-primary font-bold tracking-widest text-xs uppercase">
            Unified Stack → Single Source of Truth → Predictable ROI
          </div>
        </div>
      </section>

      {/* 1.4 How It Works */}
      <section className="py-24 bg-dark">
        <div className="container mx-auto px-6">
          <SectionHeading title="The Journey to ROI" subtitle="From initial assessment to full-scale automation in 6 months." centered />
          
          <div className="grid lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "READINESS", subtitle: "Free Workshop (30m)", items: ["Identify 10-20 processes", "Build ROI model", "Define roadmap"], next: "2-week discovery", active: true },
              { step: "02", title: "DISCOVERY", subtitle: "Process Analysis", items: ["Process mining", "Platform selection", "Tech architecture"], next: "Pilot planning" },
              { step: "03", title: "PILOT", subtitle: "PoC (60 days)", items: ["Deploy 3-5 bots", "Measure outcomes", "Validate assumptions"], next: "Full rollout" },
              { step: "04", title: "SCALE + MANAGE", subtitle: "Optimization", items: ["Managed services (RaaS)", "Advisory & expansion", "Continuous improvement"], next: "Ongoing annuity" },
            ].map((item, idx) => (
              <div key={idx} className={`relative p-8 rounded-2xl border ${item.active ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}>
                {item.active && <div className="absolute -top-3 left-8 bg-primary text-dark text-[10px] font-bold px-3 py-1 rounded-full">YOU ARE HERE</div>}
                <div className="text-4xl font-black text-slate-800 mb-4">{item.step}</div>
                <h3 className="text-lg font-bold mb-1 text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 font-medium mb-6 uppercase tracking-wider">{item.subtitle}</p>
                <ul className="space-y-3 mb-8">
                  {item.items.map((li, i) => (
                    <li key={i} className="text-sm text-slate-400 flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> {li}</li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">NEXT: {item.next}</span>
                  <button className="text-primary hover:underline text-xs font-bold uppercase tracking-widest">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1.8 Secondary CTA */}
      <section className="py-24 bg-primary flex flex-col items-center">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6">Ready to stop the manual work?</h2>
          <p className="text-lg text-dark/80 mb-10">
            Start your free 30-minute automation readiness assessment. We'll identify your top 10-20 opportunities and build an ROI model specific to your vertical.
          </p>
          <button className="px-10 py-5 bg-dark text-white font-bold rounded-xl text-lg hover:scale-105 transition-all shadow-2xl flex items-center gap-2 mx-auto group">
            Get Your Free Assessment <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-dark/60 text-sm font-medium">
            <div>No credit card required</div>
            <div>No sales pressure</div>
            <div>Takes 2 minutes</div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SolutionsPage = () => {
  return (
    <div className="pt-32 pb-24 bg-dark min-h-screen">
      <div className="container mx-auto px-6">
        <SectionHeading 
          title="Industry Vertical Solutions" 
          subtitle="Pre-built process templates and regulatory compliance baked-in for specific sectors."
        />
        
        {/* Healthcare Example Section */}
        <div className="bg-accent rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
           <div className="grid lg:grid-cols-2 gap-12 p-12 lg:p-20 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase rounded-full mb-6">
                  <Stethoscope size={14} /> Healthcare Revenue Cycle
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Claims Processing <span className="text-primary">Automation</span></h2>
                <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                  Reduce back-office FTEs by 40-60% while improving accuracy to 99%+. From 3-day manual processing to 15-minute automated cycles.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mb-10">
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="text-primary" /> HIPAA-Compliant
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="text-primary" /> ICD-10 Validation
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="text-primary" /> Payer API Connectors
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="text-primary" /> EHR Integration
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="px-8 py-4 bg-primary text-dark font-bold rounded-xl hover:scale-105 transition-transform">Start Assessment</button>
                  <button className="px-8 py-4 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5">Download Case Study</button>
                </div>
              </div>
              
              <div className="bg-dark rounded-3xl p-8 border border-white/10 relative">
                 <div className="absolute top-8 right-8 flex gap-4">
                    <div className="px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded border border-red-500/20">BEFORE: 3 DAYS</div>
                    <div className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded border border-green-500/20">AFTER: 15 MIN</div>
                 </div>
                 <h4 className="text-white font-bold mb-10 flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary" /> Automated Workflow
                 </h4>
                 <div className="space-y-8 relative">
                    <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-white/5"></div>
                    {[
                      { title: "Prior Auth Request", status: "Auto-Filled", time: "2m", color: "bg-primary" },
                      { title: "Payer API Verification", status: "Verified", time: "30s", color: "bg-primary" },
                      { title: "Claim Submission", status: "Submitted", time: "10s", color: "bg-primary" },
                      { title: "Anomaly Detection", status: "Human Review", time: "12m", color: "bg-amber-400" },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center justify-between group">
                         <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center font-bold text-dark z-10 shadow-lg shadow-primary/10`}>
                               {i + 1}
                            </div>
                            <div>
                               <div className="text-white font-bold text-sm">{step.title}</div>
                               <div className="text-slate-500 text-xs">{step.status}</div>
                            </div>
                         </div>
                         <div className="text-slate-400 text-xs font-mono">{step.time}</div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-500"><Check size={14} /></div>
                       <span className="text-xs text-slate-400">99.2% Accuracy Rate</span>
                    </div>
                    <div className="text-xs font-bold text-primary uppercase tracking-widest">Saves 8 FTEs</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Industry Grid */}
        <div className="mt-32 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { icon: <Building2 />, name: "BFSI AML", tag: "Financial Compliance", desc: "Automate anti-money laundering reporting and KYC verification for mid-tier banks." },
             { icon: <Factory />, name: "Manufacturing QC", tag: "Quality Control", desc: "Vision-based AI inspection layered with automated compliance documentation." },
             { icon: <Globe />, name: "Professional Services", tag: "IT & Consulting", desc: "End-to-end PSA automation for agencies and consulting groups (500+ employees)." },
           ].map((item, idx) => (
             <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-dark transition-colors">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{item.tag}</div>
                <h3 className="text-xl font-bold mb-4 text-white">{item.name}</h3>
                <p className="text-slate-400 mb-8">{item.desc}</p>
                <button className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors">
                  View Playbook <ChevronRight size={16} className="text-primary" />
                </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const PricingPage = () => {
  const [volume, setVolume] = useState(50000);
  const [timePerTransaction, setTimePerTransaction] = useState(20);
  const [costPerHour, setCostPerHour] = useState(35);

  const results = useMemo(() => {
    const currentCost = (volume * (timePerTransaction / 60) * costPerHour);
    const automationRate = 0.7;
    const laborSavings = currentCost * automationRate;
    const implementationCost = 225000;
    const managedServicesCost = 75000;
    const totalInvestment = implementationCost + managedServicesCost;
    const netBenefitY1 = laborSavings - totalInvestment;
    const roiY1 = (netBenefitY1 / totalInvestment) * 100;
    const paybackPeriod = (totalInvestment / laborSavings) * 12;

    return {
      currentCost,
      laborSavings,
      totalInvestment,
      netBenefitY1,
      roiY1,
      paybackPeriod
    };
  }, [volume, timePerTransaction, costPerHour]);

  return (
    <div className="pt-32 pb-24 bg-dark">
      <div className="container mx-auto px-6">
        <SectionHeading title="Transparent Pricing" subtitle="Choose the right path for your automation journey." centered />
        
        {/* PSA Tiers */}
        <div className="grid lg:grid-cols-3 gap-8 mb-32">
          {[
            { name: "Starter", price: "$99", users: "<20", features: ["Projects & Tasks", "Time Tracking", "Standard Reporting", "2 Integrations"], cta: "Start Free Trial" },
            { name: "Professional", price: "$399", users: "20-150", popular: true, features: ["Everything in Starter", "Client Billing", "Resource Planning", "10+ Integrations", "Basic AI Modules"], cta: "Schedule Demo" },
            { name: "Enterprise", price: "Custom", users: "150+", features: ["Everything in Prof", "Advanced AI (Full)", "Custom Workflows", "Unlimited Integrations", "SSO/SAML", "Dedicated Support"], cta: "Request Quote" },
          ].map((tier, idx) => (
            <div key={idx} className={`relative p-8 rounded-3xl bg-white/5 border ${tier.popular ? 'border-primary ring-4 ring-primary/10 shadow-2xl scale-105 bg-accent/40' : 'border-white/10'} flex flex-col`}>
              {tier.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-dark font-black text-[10px] px-4 py-1.5 rounded-full tracking-widest">MOST POPULAR</div>}
              <h3 className="text-2xl font-bold mb-2 text-white">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                {tier.price !== "Custom" && <span className="text-slate-400 text-sm">/user/mo</span>}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Perfect for {tier.users} person teams</p>
              <ul className="space-y-4 mb-10 flex-1">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <Check size={16} className="text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-xl font-bold transition-all ${tier.popular ? 'bg-primary text-dark hover:bg-primary/90' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* ROI Calculator */}
        <div className="bg-accent rounded-[2.5rem] overflow-hidden p-8 lg:p-20 border border-white/5">
           <div className="grid lg:grid-cols-2 gap-20">
              <div>
                 <h2 className="text-3xl font-bold text-white mb-4">Calculate Your ROI</h2>
                 <p className="text-slate-400 mb-12">See how much revenue leakage you can plug with AIITech.</p>
                 
                 <div className="space-y-10">
                    <div>
                      <div className="flex justify-between mb-4">
                         <label className="text-white text-sm font-bold uppercase tracking-wider">Annual Transaction Volume</label>
                         <span className="text-primary font-mono">{volume.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" min="1000" max="100000" step="1000" value={volume} 
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        className="w-full h-1 bg-dark rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-4">
                         <label className="text-white text-sm font-bold uppercase tracking-wider">Avg Time Per Transaction (Min)</label>
                         <span className="text-primary font-mono">{timePerTransaction}</span>
                      </div>
                      <input 
                        type="range" min="1" max="60" value={timePerTransaction} 
                        onChange={(e) => setTimePerTransaction(parseInt(e.target.value))}
                        className="w-full h-1 bg-dark rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-4">
                         <label className="text-white text-sm font-bold uppercase tracking-wider">Blended Cost Per Hour ($)</label>
                         <span className="text-primary font-mono">${costPerHour}</span>
                      </div>
                      <input 
                        type="range" min="15" max="150" value={costPerHour} 
                        onChange={(e) => setCostPerHour(parseInt(e.target.value))}
                        className="w-full h-1 bg-dark rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                 </div>
              </div>

              <div className="bg-dark/40 border border-white/5 rounded-3xl p-10 flex flex-col justify-center shadow-inner">
                 <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="p-6 bg-dark rounded-2xl border border-white/5">
                       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">CURRENT ANNUAL COST</div>
                       <div className="text-2xl font-bold text-white">${results.currentCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    </div>
                    <div className="p-6 bg-dark rounded-2xl border border-white/5">
                       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">ANNUAL LABOR SAVINGS</div>
                       <div className="text-2xl font-bold text-primary">${results.laborSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    </div>
                 </div>
                 
                 <div className="mb-10 text-center">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">EXPECTED YEAR 1 ROI</div>
                    <div className={`text-6xl font-black ${results.roiY1 > 0 ? 'text-primary' : 'text-red-400'}`}>
                      {results.roiY1.toFixed(0)}%
                    </div>
                    <div className="mt-4 text-xs text-slate-500 flex items-center justify-center gap-2">
                       <Clock size={14} /> Payback in {results.paybackPeriod.toFixed(1)} months
                    </div>
                 </div>

                 <button className="w-full py-5 bg-primary text-dark font-black rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-primary/20">
                    SCHEDULE CUSTOM ANALYSIS
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');

  return (
    <div className="min-h-screen font-sans selection:bg-primary selection:text-dark bg-dark">
      <Navbar activePage={page} setPage={setPage} />
      
      <main>
        {page === 'home' && <HomePage setPage={setPage} />}
        {page === 'solutions' && <SolutionsPage />}
        {page === 'services' && (
          <div className="pt-32 pb-24 container mx-auto px-6 text-center h-[80vh] flex flex-col items-center justify-center">
            <SectionHeading title="Professional Services" subtitle="Implementation, Managed Services, and Strategic Advisory." />
            <p className="text-slate-400 max-w-lg mb-12">Our service team ensures your unified stack is optimized for maximum ROI from day one.</p>
            <button onClick={() => setPage('home')} className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/10 hover:bg-white/20 transition-all">Return Home</button>
          </div>
        )}
        {page === 'pricing' && <PricingPage />}
        {page === 'blog' && (
          <div className="pt-32 pb-24 container mx-auto px-6">
            <SectionHeading title="Automation Insights & Trends" subtitle="Learn why 50% of RPA projects fail and how to avoid the pitfalls." centered />
            <div className="grid md:grid-cols-3 gap-8">
               {[1, 2, 3].map(i => (
                 <div key={i} className="bg-white/5 rounded-3xl overflow-hidden border border-white/5 group cursor-pointer hover:shadow-2xl hover:bg-white/10 transition-all">
                    <div className="h-48 bg-accent overflow-hidden relative">
                       <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="text-white fill-white" />
                       </div>
                       <div className="p-8">
                         <div className="w-12 h-1 bg-primary mb-4"></div>
                         <div className="text-white/5 font-black text-6xl">0{i}</div>
                       </div>
                    </div>
                    <div className="p-8">
                       <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">January 9, 2026 • 12 min read</div>
                       <h3 className="text-xl font-bold mb-4 text-white group-hover:text-primary transition-colors">Why 50% of RPA Projects Fail in 2026 (And How to Avoid It)</h3>
                       <p className="text-slate-400 text-sm line-clamp-2">The failure rate for RPA projects is inexcusably high. But with rigorous process selection and intelligent agentic AI layers, it's avoidable.</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-dark text-slate-400 py-20 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
               <div className="flex items-center gap-2 mb-8">
                  <Brain className="text-primary w-8 h-8" />
                  <span className="text-xl font-bold text-white tracking-tight">AIITech</span>
               </div>
               <p className="text-sm leading-relaxed mb-8 max-w-xs text-slate-500">
                 The AI-native automation & PSA platform that eliminates operational friction for mid-market service firms.
               </p>
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center hover:bg-primary hover:text-dark transition-all cursor-pointer"><Globe size={18} /></div>
                  <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center hover:bg-primary hover:text-dark transition-all cursor-pointer"><Target size={18} /></div>
               </div>
            </div>
            <div>
               <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-widest">Solutions</h4>
               <ul className="space-y-4 text-sm">
                  <li className="hover:text-primary cursor-pointer transition-colors">Healthcare Revenue Cycle</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">Manufacturing Quality</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">BFSI AML Compliance</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">Professional Services</li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-widest">Company</h4>
               <ul className="space-y-4 text-sm">
                  <li className="hover:text-primary cursor-pointer transition-colors">About Us</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">Case Studies</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">Pricing</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">Careers</li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-widest">Trust</h4>
               <div className="flex gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                     <ShieldCheck size={24} className="text-slate-400" />
                  </div>
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center font-bold text-[10px] text-slate-500 leading-none text-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                     SOC 2<br/>TYPE II
                  </div>
               </div>
               <p className="text-xs text-slate-600">Offices: Columbus, OH | Email: contact@aiitech.com</p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-600 uppercase tracking-tighter">
             <p>© 2026 AIITech Automation. All rights reserved.</p>
             <div className="flex gap-8">
                <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                <span className="hover:text-white cursor-pointer transition-colors">Security</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;