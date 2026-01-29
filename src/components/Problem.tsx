import { AlertCircle, Eye, TrendingDown } from "lucide-react";

export const Problem = () => {
  const problems = [
    {
      icon: Eye,
      title: "Surveillance defaults",
      description: "Data collected 'just in case,' monetized without consent, deanonymized at will.",
    },
    {
      icon: TrendingDown,
      title: "Unbounded drift",
      description: "Algorithms update silently, models retrain without provenance, behavior changes invisibly.",
    },
    {
      icon: AlertCircle,
      title: "Opaque governance",
      description: "Terms of service as law, decisions made behind closed doors, no verifiable enforcement.",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-card/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Why trust-based systems are failing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our digital infrastructure runs on surveillance, opacity, and soft guarantees.
            Users must trust platforms to behave correctly—but trust is not verifiable.
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
      </div>
    </section>
  );
};
