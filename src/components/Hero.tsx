import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

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
              <span className="text-sm text-primary font-medium">AI-Native Automation + PSA Platform</span>
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Eliminate{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Operational
              </span>{" "}
              Friction
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-[560px] leading-relaxed">
              Stop managing disconnected tools. AIISTECH unifies PSA + intelligent automation into
              one platform — delivering{" "}
              <strong className="text-foreground">280–320% ROI within 18 months</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary group"
                asChild
              >
                <a href="#assessment">
                  Start Readiness Assessment
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works">Watch Demo</a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Free 30-min workshop</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Vertical-specific ROI models</span>
              </div>
            </div>
          </div>

          {/* Right Visual — Dashboard Preview */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-primary/20 glow-primary bg-card p-6">
              {/* Mock Dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Automation Dashboard</span>
                  <span className="text-xs text-primary px-2 py-1 rounded-full bg-primary/10">Live</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Cost Savings YTD", value: "$1.2M", delta: "+18%" },
                    { label: "Automation Rate", value: "73%", delta: "+12%" },
                    { label: "Bot Uptime", value: "99.4%", delta: "+0.2%" },
                    { label: "FTE Hours Freed", value: "4,800", delta: "+320" },
                  ].map((kpi) => (
                    <div key={kpi.label} className="p-3 rounded-lg bg-background border border-border">
                      <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
                      <div className="text-lg font-bold text-foreground">{kpi.value}</div>
                      <div className="text-xs text-primary">{kpi.delta}</div>
                    </div>
                  ))}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-primary to-secondary rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground text-center">Automation Coverage: 73% of target processes</p>
              </div>
            </div>

            {/* Floating Labels */}
            <div className="absolute -left-4 top-1/4 glass px-4 py-2 rounded-lg border border-primary/30">
              <span className="text-sm font-medium text-primary">PSA → Automation → ROI</span>
            </div>
            <div className="absolute -right-4 bottom-1/4 glass px-4 py-2 rounded-lg border border-secondary/30">
              <span className="text-sm font-medium text-secondary">280% ROI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
