
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Cpu, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Activity, 
  PieChart, 
  Settings, 
  Users, 
  Menu, 
  X, 
  Check, 
  Minus,
  BrainCircuit,
  Workflow,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  Play,
  Info
} from 'lucide-react';

// --- Types ---
type Page = 'home' | 'healthcare' | 'services' | 'pricing' | 'case-studies' | 'blog';

// --- Shared Components ---

const Navbar = ({ activePage, setPage }: { activePage: Page, setPage: (p: Page) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { label: 'Platform', page: 'home' as Page },
    { label: 'Solutions', page: 'healthcare' as Page },
    { label: 'Services', page: 'services' as Page },
    { label: 'Pricing', page: 'pricing' as Page },
    { label: 'Resources', page: 'blog' as Page },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-aiistech-dark/95 backdrop-blur-md border-b border-aiistech-accent py-4">
      <div className="max-w-7xl mx-auto px-4 md:px-10 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage('home')}>
          <div className="w-10 h-10 bg-gradient-to-br from-aiistech-primary to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <BrainCircuit size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase">AIISTECH</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { setPage(item.page); window.scrollTo(0, 0); }}
              className={`text-sm font-medium transition-colors ${activePage === item.page ? 'text-aiistech-primary' : 'text-aiistech-white/70 hover:text-aiistech-primary'}`}
            >
              {item.label}
            </button>
          ))}
          <button className="text-sm font-semibold text-white bg-aiistech-primary/20 hover:bg-aiistech-primary/30 border border-aiistech-primary/50 px-5 py-2 rounded-full transition-all">
            Sign In
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-aiistech-dark px-6 py-8 flex flex-col gap-6"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { setPage(item.page); setIsOpen(false); window.scrollTo(0, 0); }}
                className="text-left text-lg font-medium text-white/80"
              >
                {item.label}
              </button>
            ))}
            <button className="w-full text-center bg-aiistech-primary py-3 rounded-xl font-bold text-aiistech-dark">
              Sign In
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = ({ setPage }: { setPage: (p: Page) => void }) => (
  <footer className="bg-aiistech-dark text-aiistech-white py-16 px-4 border-t border-aiistech-accent">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-aiistech-primary rounded-md flex items-center justify-center text-aiistech-dark">
            <BrainCircuit size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight">AIISTECH</span>
        </div>
        <p className="text-sm text-aiistech-white/50 leading-relaxed">
          Integrated AI Automation & PSA platform for mid-market service firms. Accelerate ROI with vertical-specific intelligence.
        </p>
      </div>
      
      <div>
        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-aiistech-primary">Solutions</h4>
        <ul className="flex flex-col gap-4 text-sm text-aiistech-white/60">
          <li className="hover:text-aiistech-primary cursor-pointer" onClick={() => setPage('healthcare')}>Healthcare</li>
          <li className="hover:text-aiistech-primary cursor-pointer">Manufacturing</li>
          <li className="hover:text-aiistech-primary cursor-pointer">BFSI</li>
          <li className="hover:text-aiistech-primary cursor-pointer">Professional Services</li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-aiistech-primary">Resources</h4>
        <ul className="flex flex-col gap-4 text-sm text-aiistech-white/60">
          <li className="hover:text-aiistech-primary cursor-pointer" onClick={() => setPage('blog')}>Blog</li>
          <li className="hover:text-aiistech-primary cursor-pointer" onClick={() => setPage('case-studies')}>Case Studies</li>
          <li className="hover:text-aiistech-primary cursor-pointer">Guides & Whitepapers</li>
          <li className="hover:text-aiistech-primary cursor-pointer">ROI Calculator</li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-aiistech-primary">Contact</h4>
        <ul className="flex flex-col gap-4 text-sm text-aiistech-white/60">
          <li>Offices: Columbus, OH</li>
          <li>Email: contact@aiistech.com</li>
          <li>Phone: +1 (800) AI-TECH</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-aiistech-accent flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-aiistech-white/40">
      <p>© 2026 AIISTech Automation. All rights reserved.</p>
      <div className="flex gap-8">
        <span className="hover:text-white cursor-pointer">Privacy Policy</span>
        <span className="hover:text-white cursor-pointer">Terms of Service</span>
        <span className="hover:text-white cursor-pointer">Security</span>
      </div>
    </div>
    
    {/* Google AI Studio Badge */}
    <div className="text-center py-4 border-t border-white/10 max-w-7xl mx-auto mt-8">
      <a 
        href="https://github.com/google-gemini/aistudio-repository-template"
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-flex items-center gap-2 text-sm text-aiistech-white/60 hover:text-aiistech-primary transition-colors"
        aria-label="Powered by Google AI Studio"
      >
        <Info className="w-4 h-4" />
        <span>Powered by Google AI Studio</span>
      </a>
    </div>
  </footer>
);

// --- Page: Homepage ---

const HomePage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [activeTab, setActiveTab] = useState('projects');

  const tabs = [
    { id: 'projects', label: 'Projects', icon: <Layers size={18} />, content: 'Live task tracking across 24 projects with AI-predicted timelines and real-time profitability tracking.' },
    { id: 'time', label: 'Time Tracking', icon: <Clock size={18} />, content: 'Automated time capture using background agentic AI. Zero manual entry for your teams.' },
    { id: 'billing', label: 'Billing', icon: <DollarSign size={18} />, content: 'Complex retainer and project-based billing with automated invoice generation and 99% accuracy.' },
    { id: 'automation', label: 'Automation', icon: <Workflow size={18} />, content: 'Deep integration with UiPath and custom LLM agents to automate back-office workflows 75% faster.' },
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="gradient-hero text-aiistech-white py-24 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aiistech-primary rounded-full blur-[160px]"></div>
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[160px]"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="lg:w-1/2 flex flex-col items-start gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aiistech-primary/10 border border-aiistech-primary/30 text-aiistech-primary text-xs font-bold uppercase tracking-widest">
              Now with Agentic AI Layer
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              The AI-Native <br/>Automation & <br/><span className="text-aiistech-primary italic">PSA Platform</span>
            </h1>
            <p className="text-xl text-aiistech-white/70 max-w-xl leading-relaxed">
              Stop managing 8 disconnected tools. Consolidate your PSA, automate your workflows, and eliminate manual work once and for all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setPage('pricing')}
                className="bg-aiistech-primary hover:bg-aiistech-primary/90 text-aiistech-dark px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-aiistech-primary/20 transition-all flex items-center justify-center gap-2 group"
              >
                Start Your Readiness Assessment <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2">
                Watch 2-Min Demo <Play size={20} fill="currentColor" />
              </button>
            </div>
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-2 text-sm text-aiistech-white/60">
                <CheckCircle2 size={16} className="text-aiistech-primary" /> Free 30-min workshop
              </div>
              <div className="flex items-center gap-2 text-sm text-aiistech-white/60">
                <CheckCircle2 size={16} className="text-aiistech-primary" /> No credit card required
              </div>
              <div className="flex items-center gap-2 text-sm text-aiistech-white/60">
                <CheckCircle2 size={16} className="text-aiistech-primary" /> ROI models included
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <div className="relative p-6 bg-aiistech-accent rounded-3xl border border-white/10 shadow-2xl overflow-hidden aspect-video flex items-center justify-center group">
               <div className="absolute inset-0 bg-gradient-to-br from-aiistech-primary/5 to-transparent"></div>
               {/* Visual placeholder for 3D diagram / screenshot */}
               <div className="relative z-10 w-full h-full border border-aiistech-primary/20 rounded-2xl bg-aiistech-dark/50 flex flex-col p-4 gap-4 overflow-hidden">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div className="flex gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="text-[10px] uppercase tracking-tighter text-white/30 font-mono">system_v2.6_active</div>
                  </div>
                  <div className="flex-1 flex gap-4">
                    <div className="w-1/3 border border-white/5 rounded-lg bg-white/5 p-3 flex flex-col gap-2">
                      <div className="h-2 w-full bg-white/10 rounded"></div>
                      <div className="h-2 w-3/4 bg-white/10 rounded"></div>
                      <div className="h-12 w-full bg-aiistech-primary/20 rounded-md border border-aiistech-primary/30 animate-pulse"></div>
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                       <div className="grid grid-cols-2 gap-2">
                          <div className="h-16 border border-white/5 rounded-lg bg-white/5"></div>
                          <div className="h-16 border border-white/5 rounded-lg bg-white/5"></div>
                       </div>
                       <div className="flex-1 border border-white/5 rounded-lg bg-white/5 p-4 relative">
                          <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <Workflow size={64} />
                          </div>
                          <div className="flex flex-col gap-2 relative z-10">
                            <div className="text-[10px] font-mono text-aiistech-primary">AUTOMATING...</div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="h-full w-1/3 bg-aiistech-primary"
                              />
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-aiistech-white/40 mb-10">Trusted by mid-market leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
             <span className="text-2xl font-bold tracking-tighter">GLOBEX</span>
             <span className="text-2xl font-bold tracking-tighter">CYBERDYNE</span>
             <span className="text-2xl font-bold tracking-tighter">INITECH</span>
             <span className="text-2xl font-bold tracking-tighter">ACME CORP</span>
             <span className="text-2xl font-bold tracking-tighter">HAL RES</span>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-aiistech-primary mb-4">The Problem</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Fragmented Tools + Manual Processes = Revenue Leakage</h3>
            <p className="text-lg text-slate-600">Mid-market service firms use an average of 8+ disconnected tools, leading to massive inefficiencies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                title: 'Data Fragmentation', 
                icon: <Activity size={32} />, 
                desc: 'Project data, time tracking, and billing live in silos. No single source of truth.',
                stats: '30-40% of time wasted'
              },
              { 
                title: 'Revenue Leakage', 
                icon: <TrendingUp size={32} className="rotate-180" />, 
                desc: 'Manual billing errors and untracked hours eat directly into your margins.',
                stats: '$700k+ annual loss'
              },
              { 
                title: 'Process Brittleness', 
                icon: <AlertCircle size={32} />, 
                desc: 'Legacy RPA bots fail when UIs change or unstructured data appears.',
                stats: '50% project failure rate'
              }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-aiistech-primary shadow-sm mb-8 border border-slate-100">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                <p className="text-slate-600 mb-6 leading-relaxed">{item.desc}</p>
                <div className="text-sm font-bold text-red-500 uppercase tracking-wider">{item.stats}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-4 bg-aiistech-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-aiistech-primary mb-4">Our Solution</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6">A Unified AI-First PSA + Intelligent Automation Stack</h3>
            </div>
            <p className="text-lg text-white/50 max-w-md">The only platform built to transition from professional services to outcome-based managed services.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Arrows for Desktop */}
            <div className="hidden lg:block absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 z-20 text-aiistech-primary/30">
              <ArrowRight size={48} />
            </div>
            <div className="hidden lg:block absolute top-1/2 left-2/3 -translate-y-1/2 -translate-x-1/2 z-20 text-aiistech-primary/30">
              <ArrowRight size={48} />
            </div>

            {[
              {
                title: 'AI-First PSA Platform',
                items: ['Projects & Tasks', 'Time Tracking', 'Intelligent Billing', 'Resource Forecasting'],
                accent: true
              },
              {
                title: 'Intelligent Automation',
                items: ['Agentic AI Workers', 'Self-Healing RPA', 'Document Processing', 'Workflow Orchestration'],
                accent: false
              },
              {
                title: 'Recurring Revenue',
                items: ['Managed Services (RaaS)', 'Outcome Guarantees', 'Continuous Optimization', 'Advisory Services'],
                accent: true
              }
            ].map((card, i) => (
              <div key={i} className={`p-10 rounded-3xl border ${card.accent ? 'bg-aiistech-accent border-aiistech-primary/20' : 'bg-white/5 border-white/10'}`}>
                <h4 className={`text-2xl font-bold mb-8 ${card.accent ? 'text-aiistech-primary' : 'text-white'}`}>{card.title}</h4>
                <ul className="flex flex-col gap-6">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-4 text-white/70">
                      <CheckCircle2 size={20} className="text-aiistech-primary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-aiistech-primary/10 to-transparent border border-aiistech-primary/20 flex flex-col md:flex-row items-center justify-center gap-10 text-center md:text-left">
            <div className="text-2xl font-bold">Unified Stack → Single Source of Truth → Predictable ROI</div>
            <button 
              onClick={() => setPage('healthcare')}
              className="px-8 py-3 bg-aiistech-primary text-aiistech-dark font-bold rounded-xl whitespace-nowrap"
            >
              See Industry Templates
            </button>
          </div>
        </div>
      </section>

      {/* Feature Showcase (Interactive Tabs) */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 text-slate-900">See The Platform In Action</h3>
            <p className="text-slate-600">Enterprise-grade capability with consumer-grade simplicity.</p>
          </div>

          <div className="bg-white p-4 md:p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-200">
            <div className="flex flex-wrap justify-center gap-4 mb-10 border-b border-slate-100 pb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === tab.id ? 'bg-aiistech-primary text-aiistech-dark shadow-lg shadow-aiistech-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 flex flex-col gap-8">
                <h4 className="text-3xl font-bold text-slate-900 uppercase">
                  {tabs.find(t => t.id === activeTab)?.label} Dashboard
                </h4>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {tabs.find(t => t.id === activeTab)?.content}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-aiistech-primary font-bold mb-1">99.8%</div>
                    <div className="text-xs uppercase tracking-widest text-slate-400">Process Accuracy</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-aiistech-primary font-bold mb-1">24/7</div>
                    <div className="text-xs uppercase tracking-widest text-slate-400">Agentic Monitoring</div>
                  </div>
                </div>
                <button className="self-start px-8 py-3 border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                  Book A Full Walkthrough
                </button>
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative group">
                   <div className="absolute inset-0 bg-gradient-to-br from-aiistech-primary/20 to-transparent"></div>
                   {/* Simulated Product Screenshot */}
                   <div className="p-6 h-full flex flex-col gap-4">
                      <div className="h-8 w-1/3 bg-white/10 rounded"></div>
                      <div className="flex-1 grid grid-cols-4 gap-4">
                         <div className="col-span-1 bg-white/5 rounded-lg border border-white/5"></div>
                         <div className="col-span-3 bg-white/10 rounded-lg border border-white/10 p-4">
                            <div className="flex justify-between mb-8">
                               <div className="h-6 w-24 bg-aiistech-primary/20 rounded"></div>
                               <div className="h-6 w-16 bg-white/20 rounded"></div>
                            </div>
                            <div className="space-y-4">
                               <div className="h-4 w-full bg-white/5 rounded"></div>
                               <div className="h-4 w-full bg-white/5 rounded"></div>
                               <div className="h-4 w-2/3 bg-white/5 rounded"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm cursor-pointer">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-aiistech-dark shadow-2xl">
                        <Play size={24} fill="currentColor" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-aiistech-dark text-white text-center">
        <div className="max-w-4xl mx-auto bg-aiistech-accent p-12 md:p-20 rounded-[3rem] border border-aiistech-primary/20 shadow-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-aiistech-primary/10">
            <Cpu size={120} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to stop the manual work?</h2>
          <p className="text-xl text-white/60 mb-12">
            Start your free 30-minute automation readiness assessment. We'll identify your top 10-20 automation opportunities & build an ROI model specific to your vertical.
          </p>
          <div className="flex flex-col items-center gap-6">
            <button className="w-full sm:w-auto px-12 py-5 bg-aiistech-primary text-aiistech-dark font-bold text-xl rounded-2xl shadow-2xl shadow-aiistech-primary/30 transition-transform hover:scale-105 active:scale-95">
              GET YOUR FREE ASSESSMENT →
            </button>
            <div className="flex gap-8 text-sm text-white/40 uppercase tracking-widest font-bold">
              <span>No credit card</span>
              <span>No sales pressure</span>
              <span>Takes 2 minutes</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Page: Healthcare Solutions ---

const HealthcarePage = ({ setPage }: { setPage: (p: Page) => void }) => {
  return (
    <div className="pt-24 bg-white">
      {/* Hero */}
      <section className="bg-aiistech-dark text-white py-24 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 flex flex-col items-start gap-8">
            <div className="text-aiistech-primary font-bold tracking-widest uppercase text-sm">Healthcare Solutions</div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">Healthcare Claims Processing Automation</h1>
            <p className="text-xl text-white/60">Reduce back-office FTEs by 40-60% while improving accuracy to 99%+. From 3-day manual processing to 15 minutes.</p>
            <div className="flex gap-4">
               <button className="bg-aiistech-primary text-aiistech-dark px-8 py-4 rounded-xl font-bold">Start Your Assessment</button>
               <button className="border border-white/20 px-8 py-4 rounded-xl font-bold">Download Case Study</button>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3 text-white/70"><Check size={20} className="text-aiistech-primary"/> HIPAA-compliant architecture</div>
              <div className="flex items-center gap-3 text-white/70"><Check size={20} className="text-aiistech-primary"/> Pre-built payer templates (UHC, Anthem)</div>
              <div className="flex items-center gap-3 text-white/70"><Check size={20} className="text-aiistech-primary"/> ICD-10/CPT validation baked in</div>
            </div>
          </div>
          <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
             <div className="p-8 bg-aiistech-accent rounded-3xl border border-white/10 flex flex-col justify-center items-center text-center">
                <div className="text-4xl font-bold text-aiistech-primary mb-2">15 Min</div>
                <div className="text-xs uppercase tracking-widest text-white/40">Turnaround Time</div>
             </div>
             <div className="p-8 bg-aiistech-accent rounded-3xl border border-white/10 flex flex-col justify-center items-center text-center">
                <div className="text-4xl font-bold text-aiistech-primary mb-2">8 FTEs</div>
                <div className="text-xs uppercase tracking-widest text-white/40">Savings (Typical)</div>
             </div>
             <div className="col-span-2 p-10 bg-gradient-to-br from-aiistech-primary/20 to-transparent rounded-3xl border border-aiistech-primary/30 flex items-center gap-8">
                <div className="text-7xl font-bold text-white/20">99%</div>
                <div className="text-xl font-bold leading-tight">Claims processing accuracy with Agentic AI validation</div>
             </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">The Healthcare Challenge</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="p-10 rounded-3xl bg-red-50/50 border border-red-100">
             <h4 className="flex items-center gap-3 text-2xl font-bold text-red-600 mb-8"><X className="bg-red-600 text-white rounded-full p-1" /> BEFORE AUTOMATION</h4>
             <ul className="space-y-6">
               {[
                 { label: 'Prior Auth', desc: '15-30 mins per request (manual form filling)' },
                 { label: 'Claims Submission', desc: 'Email/portal entries across 50+ payers' },
                 { label: 'Denial Management', desc: 'Manual chart reviews and rebilling' },
                 { label: 'EOB Reconciliation', desc: 'Line-item matching in Excel sheets' },
               ].map((item, i) => (
                 <li key={i} className="flex flex-col gap-1">
                   <span className="font-bold text-slate-900">{item.label}</span>
                   <span className="text-slate-500">{item.desc}</span>
                 </li>
               ))}
             </ul>
             <div className="mt-10 pt-10 border-t border-red-200 text-red-600 font-bold">
                Result: $700K-$1.2M annual revenue leakage
             </div>
          </div>

          <div className="p-10 rounded-3xl bg-green-50/50 border border-green-100">
             <h4 className="flex items-center gap-3 text-2xl font-bold text-green-600 mb-8"><Check className="bg-green-600 text-white rounded-full p-1" /> AFTER AUTOMATION (WITH US)</h4>
             <ul className="space-y-6">
               {[
                 { label: 'Prior Auth', desc: '2-minute bot + AI submission to payer APIs' },
                 { label: 'Claims Submission', desc: 'Bulk upload to all payers via AI' },
                 { label: 'Denial Management', desc: 'ML model flags high-value denials' },
                 { label: 'EOB Reconciliation', desc: 'Intelligent matching with 99% accuracy' },
               ].map((item, i) => (
                 <li key={i} className="flex flex-col gap-1">
                   <span className="font-bold text-slate-900">{item.label}</span>
                   <span className="text-slate-500">{item.desc}</span>
                 </li>
               ))}
             </ul>
             <div className="mt-10 pt-10 border-t border-green-200 text-green-600 font-bold">
                Result: 40-60% FTE reduction; $600K+ annual savings
             </div>
          </div>
        </div>
      </section>

      {/* Case Study Summary */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto bg-white p-12 md:p-20 rounded-[3rem] border border-slate-200 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-aiistech-primary font-bold uppercase text-sm mb-4">Case Study</div>
              <h3 className="text-3xl font-bold mb-6">Regional Healthcare System (300 beds)</h3>
              <p className="text-lg text-slate-600 mb-8 italic">"The bot now handles 100+ prior auth requests daily. Our team focuses on exceptions and denials—higher-value work. We've reinvested savings into patient experience."</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                <div>
                  <div className="font-bold">Janet Rodriguez</div>
                  <div className="text-sm text-slate-500">SVP Revenue Cycle Operations</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="p-6 bg-aiistech-primary text-aiistech-dark rounded-2xl">
                 <div className="text-4xl font-bold">280%</div>
                 <div className="text-sm font-bold uppercase tracking-widest mt-2">ROI (18 mos)</div>
               </div>
               <div className="p-6 bg-slate-900 text-white rounded-2xl">
                 <div className="text-4xl font-bold">$625K</div>
                 <div className="text-sm font-bold uppercase tracking-widest mt-2">Annual Savings</div>
               </div>
               <div className="col-span-2 p-6 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between">
                 <div className="font-bold">Prior Auth Time</div>
                 <div className="flex gap-4 items-center">
                    <span className="text-red-500 line-through">20m</span>
                    <ArrowRight size={16} />
                    <span className="text-green-600 font-bold">2m</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Page: Pricing & ROI Calculator ---

const PricingPage = () => {
  const [volume, setVolume] = useState(50000);
  const [timePerTransaction, setTimePerTransaction] = useState(20);
  const [costPerHour, setCostPerHour] = useState(35);
  
  const results = useMemo(() => {
    const annualLaborCost = (volume * (timePerTransaction / 60) * costPerHour);
    const automationRate = 0.7;
    const savings = annualLaborCost * automationRate;
    const implementationCost = 150000;
    const managedServicesCost = 75000;
    const totalInvestment = implementationCost + managedServicesCost;
    const netBenefitY1 = savings - totalInvestment;
    const roiY1 = (netBenefitY1 / totalInvestment) * 100;
    const paybackMonths = (totalInvestment / (savings / 12)).toFixed(1);

    return {
      annualLaborCost,
      savings,
      totalInvestment,
      netBenefitY1,
      roiY1: Math.max(0, roiY1),
      paybackMonths
    };
  }, [volume, timePerTransaction, costPerHour]);

  return (
    <div className="pt-24 bg-slate-50">
      <section className="py-20 px-4 bg-aiistech-dark text-white text-center">
        <h1 className="text-5xl font-bold mb-6">Clear Pricing. No Surprises.</h1>
        <p className="text-xl text-white/50 max-w-2xl mx-auto">Flexible plans for mid-market firms looking to scale automation from pilot to enterprise-wide rollout.</p>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 px-4 max-w-7xl mx-auto -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: 'Starter', price: '$99', desc: 'Perfect for small teams and testing initial workflows.', features: ['Projects & Tasks', 'Time Tracking', 'Standard Reporting', '2 Integrations'] },
             { title: 'Professional', price: '$399', popular: true, desc: 'Ideal for firms of 20-150 people scaling operations.', features: ['Full Client Billing', 'Resource Planning', 'Basic AI Modules', '10+ Integrations', 'Priority Support'] },
             { title: 'Enterprise', price: 'Custom', desc: 'For large organizations with complex compliance needs.', features: ['Unlimited Integrations', 'Custom Workflows', 'SSO / SAML', 'Full Agentic AI Layer', 'Dedicated Success Manager'] },
           ].map((tier, i) => (
             <div key={i} className={`p-10 rounded-[2.5rem] bg-white border ${tier.popular ? 'border-aiistech-primary shadow-2xl shadow-aiistech-primary/10 relative scale-105 z-10' : 'border-slate-200'}`}>
                {tier.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-aiistech-primary text-aiistech-dark px-6 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">Most Popular</div>}
                <h4 className="text-2xl font-bold mb-2">{tier.title}</h4>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">{tier.desc}</p>
                <div className="mb-8">
                   <span className="text-5xl font-bold">{tier.price}</span>
                   {tier.price !== 'Custom' && <span className="text-slate-400">/user/mo</span>}
                </div>
                <ul className="space-y-4 mb-10">
                   {tier.features.map((f, j) => (
                     <li key={j} className="flex items-center gap-3 text-slate-600 text-sm">
                       <Check size={16} className="text-aiistech-primary" /> {f}
                     </li>
                   ))}
                </ul>
                <button className={`w-full py-4 rounded-xl font-bold transition-all ${tier.popular ? 'bg-aiistech-primary text-aiistech-dark' : 'bg-slate-900 text-white'}`}>
                  {tier.title === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
             </div>
           ))}
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-24 px-4 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Calculate Your Expected ROI</h2>
            <p className="text-slate-600">See how automation impacts your specific back-office costs.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-10">
               <div>
                  <div className="flex justify-between mb-4">
                    <label className="font-bold text-slate-900">Annual transaction volume</label>
                    <span className="font-mono text-aiistech-primary font-bold">{volume.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="1000" max="250000" step="1000" 
                    value={volume} onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-aiistech-primary"
                  />
               </div>
               <div>
                  <div className="flex justify-between mb-4">
                    <label className="font-bold text-slate-900">Current avg time per transaction (mins)</label>
                    <span className="font-mono text-aiistech-primary font-bold">{timePerTransaction}m</span>
                  </div>
                  <input 
                    type="range" min="5" max="120" step="5" 
                    value={timePerTransaction} onChange={(e) => setTimePerTransaction(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-aiistech-primary"
                  />
               </div>
               <div>
                  <div className="flex justify-between mb-4">
                    <label className="font-bold text-slate-900">Blended hourly cost ($)</label>
                    <span className="font-mono text-aiistech-primary font-bold">${costPerHour}/hr</span>
                  </div>
                  <input 
                    type="range" min="15" max="150" step="5" 
                    value={costPerHour} onChange={(e) => setCostPerHour(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-aiistech-primary"
                  />
               </div>
               <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 italic text-slate-500 text-sm">
                 * Calculations based on 70% average automation rate and $225k first-year investment (Implementation + Managed Services).
               </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-aiistech-dark text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10 flex flex-col h-full">
                  <h4 className="text-xl font-bold mb-10 text-white/40 uppercase tracking-widest">Your Results (Customized)</h4>
                  
                  <div className="space-y-8 flex-1">
                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                      <div className="text-white/60">Annual Labor Savings</div>
                      <div className="text-3xl font-bold text-aiistech-primary">${results.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                      <div className="text-white/60">First Year Net Benefit</div>
                      <div className="text-3xl font-bold">${results.netBenefitY1.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                         <div className="text-sm text-white/40 uppercase mb-2">ROI (Y1)</div>
                         <div className={`text-4xl font-bold ${results.roiY1 > 0 ? 'text-green-500' : 'text-white'}`}>{results.roiY1.toFixed(0)}%</div>
                      </div>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                         <div className="text-sm text-white/40 uppercase mb-2">Payback Period</div>
                         <div className="text-4xl font-bold">{results.paybackMonths} <span className="text-lg">mos</span></div>
                      </div>
                    </div>
                  </div>

                  <button className="mt-12 w-full py-5 bg-aiistech-primary text-aiistech-dark font-bold text-lg rounded-2xl hover:scale-105 transition-transform">
                    SCHEDULE YOUR CUSTOM ANALYSIS
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Page: Case Studies ---

const CaseStudiesPage = () => {
  return (
    <div className="pt-24 bg-white">
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">Real Results from Real Customers</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">Explore how leaders in Healthcare, Manufacturing, and BFSI are transforming their operations.</p>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { 
              vertical: 'Healthcare', 
              title: '300-bed hospital system', 
              challenge: 'Prior auth backlog, 3-day lag', 
              result: '280% ROI', 
              roi: '280%', 
              savings: '8 FTEs',
              img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
            },
            { 
              vertical: 'Manufacturing', 
              title: 'Specialty mfg $250M revenue', 
              challenge: 'Manual QA 8 FTEs, $1.2M cost', 
              result: '320% ROI', 
              roi: '320%', 
              savings: '6.5 FTEs',
              img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
            },
            { 
              vertical: 'BFSI', 
              title: 'Regional bank $5B AUM', 
              challenge: '40% manual AML compliance', 
              result: '250% ROI', 
              roi: '250%', 
              savings: '15 FTEs',
              img: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=800'
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all">
               <div className="h-48 bg-slate-200 overflow-hidden relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 px-4 py-1.5 bg-aiistech-dark/80 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-widest">{item.vertical}</div>
               </div>
               <div className="p-8 flex flex-col flex-1">
                  <h4 className="text-2xl font-bold mb-6 group-hover:text-aiistech-primary transition-colors">{item.title}</h4>
                  <div className="space-y-4 mb-10 flex-1">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase font-bold text-slate-400">Challenge</span>
                      <span className="text-slate-600 font-medium">{item.challenge}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-4 bg-white rounded-2xl border border-slate-100">
                        <div className="text-aiistech-primary font-bold text-xl">{item.roi}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">ROI</div>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-slate-100">
                        <div className="text-slate-900 font-bold text-xl">{item.savings}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Savings</div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2">
                    READ FULL CASE STUDY <ArrowRight size={16} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Page: Blog ---

const BlogPage = () => {
  return (
    <div className="pt-24 bg-slate-50">
       <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-6">Automation Insights & Trends</h1>
              <p className="text-xl text-slate-500">The latest thought leadership for service firms looking to scale with AI.</p>
            </div>
            <div className="flex gap-4">
              <input type="text" placeholder="Search articles..." className="px-6 py-3 rounded-xl border border-slate-200 focus:ring-2 ring-aiistech-primary outline-none" />
              <button className="px-8 py-3 bg-aiistech-dark text-white font-bold rounded-xl">Search</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Featured Post */}
            <div className="lg:col-span-2 bg-aiistech-dark rounded-[3rem] overflow-hidden flex flex-col md:flex-row text-white group cursor-pointer border border-white/5">
               <div className="md:w-1/2 overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-60" />
               </div>
               <div className="md:w-1/2 p-12 flex flex-col justify-center">
                  <div className="text-aiistech-primary font-bold uppercase text-xs mb-4">Featured Post</div>
                  <h2 className="text-3xl font-bold mb-6 group-hover:text-aiistech-primary transition-colors">Why 50% of RPA Projects Fail (And How to Fix It)</h2>
                  <p className="text-white/60 mb-8 leading-relaxed">The 7 root causes of RPA implementation failures and the proven mitigation strategies we use in every project.</p>
                  <div className="flex items-center gap-4 text-sm text-white/40">
                     <span>12-min read</span>
                     <span>•</span>
                     <span>Jan 9, 2026</span>
                  </div>
               </div>
            </div>

            <div className="space-y-10">
               {[
                 { title: 'Agentic AI vs. Traditional RPA: (2026 Update)', time: '8-min read', category: 'Technology' },
                 { title: '5 Ways to Reduce Revenue Leakage with AI', time: '10-min read', category: 'Strategy' },
                 { title: 'The Future of Professional Services is Managed', time: '15-min read', category: 'Industry' },
               ].map((post, i) => (
                 <div key={i} className="p-8 bg-white rounded-3xl border border-slate-200 hover:shadow-xl transition-all group cursor-pointer">
                    <div className="text-aiistech-primary font-bold uppercase text-[10px] mb-2">{post.category}</div>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-aiistech-primary transition-colors leading-snug">{post.title}</h3>
                    <div className="text-slate-400 text-xs font-medium">{post.time}</div>
                 </div>
               ))}
            </div>
          </div>
       </section>
    </div>
  );
};

// --- Page Router ---

const App: React.FC = () => {
  const [activePage, setPage] = useState<Page>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  const renderPage = () => {
    switch(activePage) {
      case 'home': return <HomePage setPage={setPage} />;
      case 'healthcare': return <HealthcarePage setPage={setPage} />;
      case 'pricing': return <PricingPage />;
      case 'case-studies': return <CaseStudiesPage />;
      case 'blog': return <BlogPage />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-aiistech-primary selection:text-aiistech-dark">
      <Navbar activePage={activePage} setPage={setPage} />
      
      <main>
        {renderPage()}
      </main>

      <Footer setPage={setPage} />
    </div>
  );
};

export default App;
