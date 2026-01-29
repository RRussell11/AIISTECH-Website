import { Heart, CreditCard, Brain, ArrowRight } from "lucide-react";

export const Protocols = () => {
  const protocols = [
    {
      icon: Heart,
      title: "Healthcare",
      points: [
        "Patient records stay client-side",
        "Diagnoses verified by zk proofs",
        "Compliance auditable without data exposure",
      ],
      color: "primary",
    },
    {
      icon: CreditCard,
      title: "Banking & Payments",
      points: [
        "Transactions prove lawfulness before settlement",
        "KYC/AML enforced via proofs, not surveillance",
        "Cross-border compliance without intermediaries",
      ],
      color: "secondary",
    },
    {
      icon: Brain,
      title: "AI & Research",
      points: [
        "Model outputs provably aligned with constraints",
        "Training data never leaves source",
        "Research collaboration without data sharing",
      ],
      color: "primary",
    },
  ];

  return (
    <section id="protocols" className="py-20 lg:py-32 bg-card/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">What you can build today</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Protocols live on ΛProof. Start building proof-first systems for real-world use cases.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {protocols.map((protocol, index) => (
            <div
              key={index}
              className="group p-6 lg:p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:scale-105"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                  protocol.color === "primary"
                    ? "from-primary/20 to-primary/10"
                    : "from-secondary/20 to-secondary/10"
                } flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <protocol.icon
                  className={`w-7 h-7 ${
                    protocol.color === "primary" ? "text-primary" : "text-secondary"
                  }`}
                />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-4">{protocol.title}</h3>

              {/* Points */}
              <ul className="space-y-3 mb-6">
                {protocol.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* Learn More Link */}
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
