import { RefreshCw, Shield, Archive, Lock } from "lucide-react";

export const Guarantees = () => {
  const guarantees = [
    {
      number: "01",
      title: "Prime-lawful recursion",
      description:
        "Every state transition is verifiably derived from a prime-indexed identity. No hidden state, no drift.",
      icon: RefreshCw,
    },
    {
      number: "02",
      title: "Ethical invariants",
      description:
        "All actions must commute with mathematically encoded ethical constraints. Violations are rejected at proof-time.",
      icon: Shield,
    },
    {
      number: "03",
      title: "Audit without surveillance",
      description:
        "Archivum stores cryptographic receipts, not raw data. Regulators verify compliance without accessing private information.",
      icon: Archive,
    },
    {
      number: "04",
      title: "User sovereignty",
      description:
        "You control your identity, capabilities, and consent. Permissions are provable, scoped, and revocable.",
      icon: Lock,
    },
  ];

  return (
    <section className="py-20 lg:py-32 cosmic-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">What ΛProof guarantees</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four core guarantees ensure your systems are verifiable, ethical, and user-first.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {guarantees.map((guarantee, index) => (
            <div
              key={index}
              className="group p-6 lg:p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(72,230,200,0.15)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-bold text-primary tracking-wider">
                  GUARANTEE {guarantee.number}
                </span>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <guarantee.icon className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3">{guarantee.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{guarantee.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
