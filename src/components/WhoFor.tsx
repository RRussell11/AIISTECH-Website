import { Hospital, Factory, Building2, Briefcase } from "lucide-react";

export const WhoFor = () => {
  const audiences = [
    {
      icon: Hospital,
      title: "Healthcare organizations",
      description:
        "Revenue cycle management, prior authorization, patient intake, and claims processing. Reduce denial rates by 40%+ while maintaining full HIPAA compliance.",
    },
    {
      icon: Factory,
      title: "Manufacturers",
      description:
        "Quality control, supply chain reconciliation, inventory management, and compliance reporting. Cut back-office costs by 30% while improving accuracy.",
    },
    {
      icon: Building2,
      title: "BFSI enterprises",
      description:
        "KYC/AML, loan origination, regulatory reporting, and fraud detection. Speed up compliance processes by 60%+ without additional headcount.",
    },
    {
      icon: Briefcase,
      title: "Professional services firms",
      description:
        "IT, consulting, creative agencies, and legal firms seeking to automate time tracking, billing, and client onboarding — boosting billable utilization by 15–20%.",
    },
  ];

  return (
    <section className="py-20 lg:py-32 cosmic-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Who AIISTECH is for</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mid-market enterprises (500–5,000 employees) in high-complexity, high-compliance
            verticals — where automation ROI is greatest and implementation expertise matters most.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="group p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <audience.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3">{audience.title}</h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
