import { Key, Zap, FileCheck } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Key,
      title: "Prime Identity (Ξ₀)",
      description:
        "Every user starts with a genesis state—a prime-indexed identity that serves as the root of all future proofs.",
      detail: "Ξ₀ is your cryptographic anchor. All actions trace back to this immutable origin.",
    },
    {
      icon: Zap,
      title: "Client-side zk Proofs",
      description:
        "Before any RPC call or state change, your client generates a cryptographic proof using Circom circuits and Groth16.",
      detail: "Proofs verify lawfulness without exposing private data. Computation happens locally.",
    },
    {
      icon: FileCheck,
      title: "Archivum & Lawful Gates",
      description:
        "The proof is validated by the RootContract. If lawful, a prime-indexed receipt is stored in Archivum.",
      detail: "Every action creates an auditable, tamper-proof record—but only of proofs, not data.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-card/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">How ΛProof works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every action must prove it is lawful before it exists. Three steps guarantee this.
          </p>
        </div>

        {/* Three-Step Flow */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-16 left-[16.666%] right-[16.666%] h-0.5 bg-gradient-to-r from-primary via-primary to-secondary" />

          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Card */}
              <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 glow-primary">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Step Number */}
                <div className="text-xs font-bold text-primary mb-2">STEP {index + 1}</div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

                {/* Detail */}
                <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                  {step.detail}
                </p>
              </div>

              {/* Arrow (Mobile) */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center my-4">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-secondary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Highlight */}
        <div className="mt-12 p-6 rounded-xl border border-primary/30 bg-primary/5 text-center">
          <p className="text-sm text-foreground">
            <strong>The result:</strong> A system where every action is provably lawful, auditable,
            and user-sovereign—without surveillance.
          </p>
        </div>
      </div>
    </section>
  );
};
