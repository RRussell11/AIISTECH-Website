import { Users, Building2, GraduationCap } from "lucide-react";

export const WhoFor = () => {
  const audiences = [
    {
      icon: Users,
      title: "Builders & protocol teams",
      description:
        "Build the next generation of Web4 applications with proof-first architecture. Access tools, circuits, and reference implementations.",
    },
    {
      icon: Building2,
      title: "Institutions & regulators",
      description:
        "Verify compliance and audit systems without accessing private data. ΛProof enables lawful governance without surveillance.",
    },
    {
      icon: GraduationCap,
      title: "Researchers & communities",
      description:
        "Explore cryptographic primitives, ethical constraints, and proof systems. Contribute to the future of sovereign computing.",
    },
  ];

  return (
    <section className="py-20 lg:py-32 cosmic-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Who is ΛProof for?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ΛProof serves everyone building, regulating, or researching the future of digital systems.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="group p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
