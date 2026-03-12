import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Constitution = () => {
  const plans = [
    {
      name: "Essential",
      subtitle: "PSA Starter",
      price: "$99–$199",
      period: "/month",
      description: "For small teams and freelancers getting started with PSA.",
      features: [
        "Project & task management",
        "Time tracking (up to 20 users)",
        "Basic invoicing & billing",
        "Standard reports & dashboards",
        "Email support",
      ],
      cta: "Start Free Trial",
      ctaHref: "#assessment",
      highlight: false,
    },
    {
      name: "Professional",
      subtitle: "PSA + Automation",
      price: "$399–$699",
      period: "/month",
      description: "For growing firms ready to add intelligent automation.",
      features: [
        "Everything in Essential",
        "Advanced automation workflows",
        "Client portal & self-service",
        "Role-based analytics dashboards",
        "HubSpot/Salesforce integration",
        "QuickBooks/Xero connectors",
        "Priority support",
      ],
      cta: "Start Assessment",
      ctaHref: "#assessment",
      highlight: true,
    },
    {
      name: "Enterprise",
      subtitle: "Full Platform + Managed Services",
      price: "Custom",
      period: "",
      description: "For large organizations seeking full automation transformation.",
      features: [
        "Everything in Professional",
        "Custom workflow automation",
        "Agentic AI modules",
        "Multi-entity support",
        "Dedicated implementation team",
        "24/7 managed services (RaaS)",
        "SLA-backed uptime & support",
        "Outcome-based pricing available",
      ],
      cta: "Contact Sales",
      ctaHref: "#contact",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-32 cosmic-bg relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start with PSA, add automation when you're ready. Scale to managed services as you grow.
            No hidden fees, no vendor lock-in.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 flex flex-col ${
                plan.highlight
                  ? "border-primary bg-primary/5 shadow-[0_0_40px_rgba(72,230,200,0.2)]"
                  : "border-border bg-card hover:border-primary/50 hover:-translate-y-1"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="text-xs font-bold text-primary tracking-wider uppercase mb-1">
                  {plan.subtitle}
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "variant-outline"
                }`}
                variant={plan.highlight ? "default" : "outline"}
                asChild
              >
                <a href={plan.ctaHref}>{plan.cta}</a>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Implementation and managed services priced separately. Contact us for a custom quote tailored to your vertical and scope.
        </p>
      </div>
    </section>
  );
};
