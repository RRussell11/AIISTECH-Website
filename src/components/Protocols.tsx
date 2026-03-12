import { Heart, Factory, Landmark, Briefcase, ArrowRight } from "lucide-react";

export const Protocols = () => {
  const verticals = [
    {
      icon: Heart,
      title: "Healthcare",
      subtitle: "Revenue Cycle & Prior Auth",
      points: [
        "Prior authorization & claims intake automation",
        "Revenue cycle analytics & denial management",
        "Patient intake & scheduling automation",
        "HIPAA-compliant bot orchestration",
      ],
      roi: "42% reduction in claims denial rate",
      color: "primary",
    },
    {
      icon: Factory,
      title: "Manufacturing",
      subtitle: "Quality & Supply Chain",
      points: [
        "Quality control inspection automation",
        "Inventory & order reconciliation",
        "Supplier compliance monitoring",
        "Production reporting & anomaly detection",
      ],
      roi: "31% reduction in quality control costs",
      color: "secondary",
    },
    {
      icon: Landmark,
      title: "BFSI",
      subtitle: "Compliance & AML",
      points: [
        "KYC/AML process automation",
        "Loan origination & underwriting",
        "Regulatory reporting automation",
        "Fraud detection orchestration",
      ],
      roi: "67% faster regulatory reporting",
      color: "primary",
    },
    {
      icon: Briefcase,
      title: "Professional Services",
      subtitle: "Time Tracking & Billing",
      points: [
        "Automated time capture & billing",
        "Invoice generation & collections",
        "Utilization & profitability analytics",
        "Client onboarding automation",
      ],
      roi: "18% increase in billable utilization",
      color: "secondary",
    },
  ];

  return (
    <section id="solutions" className="py-20 lg:py-32 bg-card/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Vertical-specific solutions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pre-built automation packages for the verticals where we have proven delivery — with
            domain expertise baked into every implementation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {verticals.map((vertical, index) => (
            <div
              key={index}
              className="group p-6 lg:p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                  vertical.color === "primary"
                    ? "from-primary/20 to-primary/10"
                    : "from-secondary/20 to-secondary/10"
                } flex items-center justify-center mb-5`}
              >
                <vertical.icon
                  className={`w-7 h-7 ${
                    vertical.color === "primary" ? "text-primary" : "text-secondary"
                  }`}
                />
              </div>

              {/* Title */}
              <div className="text-xs font-bold text-primary tracking-wider mb-1 uppercase">
                {vertical.subtitle}
              </div>
              <h3 className="text-2xl font-bold mb-4">{vertical.title}</h3>

              {/* Points */}
              <ul className="space-y-2 mb-5">
                {vertical.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* ROI */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">{vertical.roi}</span>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
