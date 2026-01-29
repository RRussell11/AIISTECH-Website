import { Shield, Lock, Fingerprint, Database } from "lucide-react";

export const WhatIsLambdaProof = () => {
  const features = [
    {
      title: "MTPI – Meta-Theorem of Prime Identity",
      description: "Models users and systems as prime-indexed identities that compose without hidden drift.",
      icon: Fingerprint,
    },
    {
      title: "PLICs – Prime-Lawful Invariant Contracts",
      description: "Smart contracts that enforce ethical constraints and bounded behavior mathematically.",
      icon: Shield,
    },
    {
      title: "CSL – Conscious Sovereignty Layer",
      description: "Users maintain provable control over identity, capabilities, and consent.",
      icon: Lock,
    },
    {
      title: "Archivum – Proof-only Audit Layer",
      description: "Prime-indexed receipts create verifiable history without exposing raw data.",
      icon: Database,
    },
  ];

  return (
    <section className="py-20 lg:py-32 cosmic-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Text */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">What is ΛProof?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ΛProof is an architectural pattern and protocol stack for building proof-first digital
              systems. Instead of trusting institutions, we trust proofs. Instead of collecting data,
              we collect lawful receipts.
            </p>
            <p className="text-muted-foreground">
              Every state transition in a ΛProof system must be accompanied by a cryptographic proof
              that the transition is lawful, ethically constrained, and user-sovereign.
            </p>
            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Zero-knowledge proofs</strong> verify
                  correctness without exposing data
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Prime-indexing</strong> enables composition
                  without drift
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Ethical invariants</strong> are encoded and
                  enforced mathematically
                </p>
              </div>
            </div>
          </div>

          {/* Right: Feature Pills */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:translate-x-2"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
