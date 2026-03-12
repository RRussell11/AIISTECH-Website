import { AlertTriangle, TrendingDown, Layers } from "lucide-react";

export const Problem = () => {
  const problems = [
    {
      icon: Layers,
      title: "Fragmented tools",
      description:
        "Your team juggles 8+ disconnected tools — project management, time tracking, billing, legacy RPA bots, and analytics — each creating data silos and manual reconciliation.",
    },
    {
      icon: TrendingDown,
      title: "Revenue leakage",
      description:
        "Manual processes consume 30–40% of back-office team time. Missed billable hours, invoice errors, and unbilled work silently drain 15–20% of potential revenue.",
    },
    {
      icon: AlertTriangle,
      title: "RPA failures",
      description:
        "30–50% of RPA initiatives fail due to brittle bots, inability to handle exceptions, and unstructured data. Without intelligent orchestration, automation ROI remains elusive.",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-card/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            The problem: fragmented tools + manual processes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mid-market enterprises are stuck between legacy workflows and failed automation
            initiatives — unable to realize the ROI that modern AI-native platforms deliver.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <problem.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 p-8 rounded-2xl border border-border bg-card/30">
          {[
            { stat: "8+", label: "Disconnected tools the average mid-market firm manages" },
            { stat: "30–40%", label: "Of back-office time consumed by manual processes" },
            { stat: "50%", label: "Of RPA projects fail without intelligent orchestration" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {item.stat}
              </div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
