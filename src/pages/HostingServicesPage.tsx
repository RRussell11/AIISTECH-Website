import { Check, Server, Shield, Zap, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const hostingPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    description:
      "Perfect for small organizations and non-profits getting started online.",
    features: [
      "10 GB SSD Storage",
      "100 GB Bandwidth",
      "1 Website",
      "Free SSL Certificate",
      "99.9% Uptime Guarantee",
      "Email Support",
    ],
    highlight: false,
    cta: "Get Started",
  },
  {
    name: "Professional",
    price: "$79",
    period: "/mo",
    description:
      "Ideal for growing organizations that need reliable, scalable hosting.",
    features: [
      "50 GB SSD Storage",
      "Unlimited Bandwidth",
      "10 Websites",
      "Free SSL Certificate",
      "99.99% Uptime Guarantee",
      "Daily Backups",
      "Priority Support (24/7)",
      "CDN Included",
    ],
    highlight: true,
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/mo",
    description:
      "For large organizations requiring maximum performance and dedicated resources.",
    features: [
      "200 GB SSD Storage",
      "Unlimited Bandwidth",
      "Unlimited Websites",
      "Free SSL Certificate",
      "99.999% Uptime SLA",
      "Hourly Backups",
      "Dedicated Account Manager",
      "DDoS Protection",
      "Custom CDN Configuration",
      "Server-Level Customization",
    ],
    highlight: false,
    cta: "Contact Sales",
  },
];

const highlights = [
  {
    icon: Server,
    title: "High-Performance Infrastructure",
    description:
      "NVMe SSD-backed servers deployed across globally distributed data centers for blazing-fast load times and minimal latency.",
  },
  {
    icon: Shield,
    title: "Security-First Architecture",
    description:
      "256-bit SSL encryption, automated DDoS mitigation, WAF protection, and daily off-site backups keep your data safe.",
  },
  {
    icon: Zap,
    title: "Always-On Availability",
    description:
      "Redundant network links, auto-failover, and proactive monitoring deliver industry-leading uptime SLAs.",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Support",
    description:
      "Our team of hosting engineers is available around the clock to troubleshoot issues and help you scale confidently.",
  },
];

const HostingServicesPage = () => {
  const contactHref = "/#contact";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-24 lg:py-32 cosmic-bg overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            <div
              className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="max-w-[1280px] mx-auto px-6 lg:px-20 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <span className="text-sm text-primary font-medium">Hosting Services</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
              Reliable Hosting for Every{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Organization
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              From secure web hosting to enterprise-grade managed infrastructure — we keep your digital
              presence running fast, safe, and always available.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                asChild
              >
                <a href="#plans">View Plans</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={contactHref}>Talk to an Expert</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {[
                { value: "99.99%", label: "Uptime SLA" },
                { value: "24/7", label: "Expert Support" },
                { value: "<1s", label: "Avg. Response Time" },
                { value: "256-bit", label: "SSL Encryption" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl p-6 text-center border border-primary/20"
                >
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 lg:py-28 bg-card/50">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Built for Performance &amp; Peace of Mind
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                All plans include free migration assistance, automatic security patches, and our
                industry-leading support.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hosting Plans */}
        <section id="plans" className="py-20 lg:py-28">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Choose Your Hosting Plan</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transparent pricing with no hidden fees. Upgrade or downgrade anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {hostingPlans.map((plan, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 ${
                    plan.highlight
                      ? "bg-gradient-to-b from-primary/10 to-secondary/5 border-2 border-primary glow-primary scale-105"
                      : "bg-card border border-border hover:border-primary/50"
                  }`}
                >
                  {plan.highlight && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="flex items-end gap-1">
                    <span
                      className={`text-5xl font-bold ${
                        plan.highlight ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className="mb-2 text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.highlight ? "default" : "outline"}
                    className={
                      plan.highlight
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                        : ""
                    }
                    asChild
                  >
                    <a href={contactHref}>{plan.cta}</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border-y border-primary/20">
          <div className="max-w-3xl mx-auto px-6 lg:px-20 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact us to discuss which hosting plan fits your organization and get a free migration
              assessment.
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
              asChild
            >
              <a href={contactHref}>Contact Us Today</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HostingServicesPage;
