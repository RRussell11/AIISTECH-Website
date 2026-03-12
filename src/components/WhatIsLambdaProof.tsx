import { LayoutDashboard, Bot, RefreshCw, ArrowRight } from "lucide-react";

export const WhatIsLambdaProof = () => {
  const pillars = [
    {
      icon: LayoutDashboard,
      title: "AI-First PSA Platform",
      subtitle: "AIISTECH Org",
      description:
        "Unified project management, time tracking, billing, and resource planning — with AI automation built in from day one.",
      points: [
        "Project & task management",
        "Time tracking & billable hours",
        "Client billing & invoicing",
        "Resource allocation optimization",
        "Real-time profitability analytics",
      ],
      accent: "primary",
    },
    {
      icon: Bot,
      title: "Intelligent Automation Services",
      subtitle: "RPA + Agentic AI",
      description:
        "We implement, manage, and optimize RPA bots and AI agents across your highest-value processes — with vertical-specific expertise.",
      points: [
        "UiPath, Automation Anywhere, Power Automate",
        "Agentic AI for document processing",
        "Process orchestration & optimization",
        "Center of Excellence (CoE) setup",
        "Exception handling & intelligent routing",
      ],
      accent: "secondary",
    },
    {
      icon: RefreshCw,
      title: "Managed Services (RaaS)",
      subtitle: "Recurring Revenue Annuity",
      description:
        "24/7 bot monitoring, maintenance, and continuous improvement — creating a predictable annuity of $5K–$50K/month per client.",
      points: [
        "24/7 bot monitoring & maintenance",
        "AI model fine-tuning",
        "Strategic automation roadmapping",
        "SLA-backed uptime guarantees",
        "Monthly performance reporting",
      ],
      accent: "primary",
    },
  ];

  return (
    <section id="platform" className="py-20 lg:py-32 cosmic-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Our solution: AI-driven PSA + intelligent automation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A unified three-layer stack that replaces fragmented tools with a single source of
            truth — from project management through automation delivery to managed services.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="group p-6 lg:p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                  pillar.accent === "primary"
                    ? "from-primary/20 to-primary/10"
                    : "from-secondary/20 to-secondary/10"
                } flex items-center justify-center mb-5`}
              >
                <pillar.icon
                  className={`w-7 h-7 ${
                    pillar.accent === "primary" ? "text-primary" : "text-secondary"
                  }`}
                />
              </div>

              <div className="text-xs font-bold text-primary tracking-wider mb-1 uppercase">
                {pillar.subtitle}
              </div>
              <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {pillar.description}
              </p>

              <ul className="space-y-2 flex-1">
                {pillar.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all mt-6"
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl border border-primary/30 bg-primary/5 text-center">
          <p className="text-foreground">
            <strong>The result:</strong> A unified stack → single source of truth → predictable ROI.
            Clients see{" "}
            <strong className="text-primary">280–320% ROI within 18 months</strong> of deployment.
          </p>
        </div>
      </div>
    </section>
  );
};
