import { Target, Zap, DollarSign, Shield } from "lucide-react";

export const Guarantees = () => {
  const advantages = [
    {
      number: "01",
      title: "Vertical experts, not generalists",
      description:
        "Deep domain knowledge in Healthcare, Manufacturing, BFSI, and Professional Services. We know your processes, your compliance requirements, and your KPIs — before day one.",
      icon: Target,
    },
    {
      number: "02",
      title: "60–90 day implementations",
      description:
        "We deliver working automation in 60–90 days at $75K–$200K — vs. Deloitte and Accenture's 6–12 months at $500K–$2M. Speed is our competitive moat.",
      icon: Zap,
    },
    {
      number: "03",
      title: "Outcome-based pricing",
      description:
        "We offer 20–30% of documented savings over 24 months as an option. We only win when you win. No upfront risk, no long-term lock-in.",
      icon: DollarSign,
    },
    {
      number: "04",
      title: "AI-forward, legacy-compatible",
      description:
        "We bridge your existing RPA investments to agentic AI — adding intelligence on top of UiPath and Power Automate bots rather than ripping and replacing.",
      icon: Shield,
    },
  ];

  return (
    <section className="py-20 lg:py-32 cosmic-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why we win</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four unfair advantages that large consulting firms and generic RPA vendors cannot replicate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="group p-6 lg:p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(72,230,200,0.15)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-bold text-primary tracking-wider">
                  ADVANTAGE {advantage.number}
                </span>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <advantage.icon className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
