import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroVisual from "@/assets/hero-visual.svg";

export const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center cosmic-bg overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-20 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5">
              <span className="text-sm text-primary font-medium">Introducing ΛProof</span>
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Proof-first personal computing for{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Web4
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-[560px] leading-relaxed">
              Every state transition must prove it is lawful, ethically constrained, and user-sovereign.
              No surveillance. No hidden drift. Only verifiable receipts.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary group"
              >
                Read the ΛProof Paper
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                Start Building
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Zero surveillance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Ethical invariants</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Quantum-ready</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-primary/20 glow-primary">
              <img
                src={heroVisual}
                alt="ΛProof proof pipeline visualization"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            {/* Floating Labels */}
            <div className="absolute -left-4 top-1/4 glass px-4 py-2 rounded-lg border border-primary/30">
              <span className="text-sm font-medium text-primary">Identity → Proof</span>
            </div>
            <div className="absolute -right-4 bottom-1/4 glass px-4 py-2 rounded-lg border border-secondary/30">
              <span className="text-sm font-medium text-secondary">Archivum</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
