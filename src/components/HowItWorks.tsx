import { Search, Map, Rocket, TrendingUp } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Readiness Assessment",
      subtitle: "Free Workshop (30 min)",
      description:
        "We identify your top 10–20 automatable processes, build a custom ROI model, and define your automation roadmap.",
      detail: "Zero cost. Walk away with a prioritized process list and ROI estimate.",
      cta: "Start Free",
      ctaHref: "#assessment",
    },
    {
      icon: Map,
      title: "Discovery",
      subtitle: "Detailed Process Analysis (2 weeks)",
      description:
        "Deep-dive process mining, platform selection (UiPath, Power Automate, Automation Anywhere), and technical architecture design.",
      detail: "Fixed-fee $2,500 engagement. Deliverable: full automation architecture document.",
      cta: "Learn More",
      ctaHref: "#platform",
    },
    {
      icon: Rocket,
      title: "Pilot",
      subtitle: "Proof of Concept (60 days)",
      description:
        "Deploy 3–5 key bots across your highest-value processes. Measure outcomes, validate ROI assumptions, and build confidence.",
      detail: "Pilot investment: $75K–$150K. Typical time-to-ROI: 90 days.",
      cta: "See Case Studies",
      ctaHref: "#solutions",
    },
    {
      icon: TrendingUp,
      title: "Scale + Manage",
      subtitle: "Ongoing Optimization (Month 3+)",
      description:
        "Full automation rollout with managed services. 24/7 bot monitoring, continuous improvement, and strategic advisory.",
      detail: "Managed services: $5K–$50K/month. 280–320% ROI in 18 months.",
      cta: "View Pricing",
      ctaHref: "#pricing",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-card/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            From assessment to results: 6 months to ROI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A proven 4-stage delivery model that takes you from process identification to
            measurable, recurring ROI — with zero upfront risk.
          </p>
        </div>

        {/* Four-Step Flow */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-40" />

          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Card */}
              <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 relative z-10 flex flex-col h-full">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 glow-primary">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Step Number */}
                <div className="text-xs font-bold text-primary mb-1">STEP {index + 1}</div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                <div className="text-xs text-muted-foreground mb-3 font-medium">{step.subtitle}</div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3 flex-1">{step.description}</p>

                {/* Detail */}
                <p className="text-xs text-primary/80 italic border-l-2 border-primary/30 pl-3 mb-4">
                  {step.detail}
                </p>

                <a
                  href={step.ctaHref}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  {step.cta} →
                </a>
              </div>

              {/* Arrow (Mobile) */}
              {index < steps.length - 1 && (
                <div className="lg:hidden flex justify-center my-4">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-secondary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Highlight */}
        <div className="mt-12 p-6 rounded-xl border border-primary/30 bg-primary/5 text-center">
          <p className="text-foreground">
            <strong>Average client outcome:</strong> $1.2M in documented savings within 12 months,
            73% automation coverage, 99.4% bot uptime across managed deployments.
          </p>
        </div>
      </div>
    </section>
  );
};
