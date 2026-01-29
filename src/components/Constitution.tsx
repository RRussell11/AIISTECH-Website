export const Constitution = () => {
  const principles = [
    {
      number: "1",
      title: "Prime-indexability",
      description:
        "Every identity, action, and state must be decomposable into prime-indexed components. No hidden composition.",
    },
    {
      number: "2",
      title: "Recursive decodability",
      description:
        "Any observer with appropriate keys can verify the lawfulness of a proof without reconstructing private data.",
    },
    {
      number: "3",
      title: "Identity persistence",
      description:
        "Prime identities are immutable. All changes must be provably derived from Ξ₀ through lawful transitions.",
    },
  ];

  return (
    <section className="py-20 lg:py-32 cosmic-bg relative overflow-hidden">
      {/* Background Sigil */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="w-96 h-96 border-4 border-primary rounded-full animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-80 h-80 border-4 border-secondary rounded-full animate-[spin_40s_linear_infinite_reverse]" />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/5">
              <span className="text-sm text-secondary font-medium">The Foundation</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold">The Ξ-Constitution</h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              The Ξ-Constitution is the mathematical law of ΛProof. It defines the invariants that
              all systems must satisfy to be considered lawful, sovereign, and proof-first.
            </p>

            <p className="text-muted-foreground">
              These principles are not policy documents—they are mathematically enforced constraints
              that govern recursion, identity, and state transitions in the ΛProof stack.
            </p>

            <div className="pt-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ξ
              </span>
              <span className="text-sm text-muted-foreground ml-3">
                The symbol of constitutional law in Web4
              </span>
            </div>
          </div>

          {/* Right: Principles */}
          <div className="space-y-4">
            {principles.map((principle) => (
              <div
                key={principle.number}
                className="p-6 rounded-xl border border-border bg-card hover:border-secondary/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Number Badge */}
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 font-bold text-secondary">
                    {principle.number}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-bold mb-2">{principle.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {principle.description}
                    </p>
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
