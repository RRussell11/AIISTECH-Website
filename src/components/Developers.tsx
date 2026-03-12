import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator } from "lucide-react";

const INDUSTRY_MULTIPLIERS: Record<string, number> = {
  healthcare: 1.5,
  manufacturing: 1.3,
  bfsi: 1.6,
  professional: 1.2,
};

const SIZE_MULTIPLIERS: Record<string, { label: string; multiplier: number; base: number }> = {
  small: { label: "100–499 employees", multiplier: 0.8, base: 50000 },
  mid: { label: "500–1,999 employees", multiplier: 1.0, base: 100000 },
  large: { label: "2,000–4,999 employees", multiplier: 1.5, base: 200000 },
  enterprise: { label: "5,000+ employees", multiplier: 2.5, base: 400000 },
};

export const Developers = () => {
  const [industry, setIndustry] = useState("healthcare");
  const [size, setSize] = useState("mid");
  const [processes, setProcesses] = useState(10);
  const [calculated, setCalculated] = useState(false);

  const sizeConfig = SIZE_MULTIPLIERS[size];
  const industryMult = INDUSTRY_MULTIPLIERS[industry];
  const processValue = Math.round((sizeConfig.base * industryMult * (processes / 10)) / 1000) * 1000;
  const annualSavings = Math.round(processValue * 1.4 / 1000) * 1000;
  const roi = Math.round((annualSavings / processValue) * 100);
  const paybackMonths = Math.ceil((processValue / annualSavings) * 12);

  return (
    <section id="roi-calculator" className="py-20 lg:py-32 bg-card/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Calculator */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-primary" />
              <span className="text-xs font-bold text-primary tracking-wider uppercase">ROI Calculator</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Estimate your automation ROI
            </h2>
            <p className="text-muted-foreground mb-8">
              Answer three questions to get a ballpark ROI estimate for your organization. Our
              readiness assessment will sharpen these numbers with your actual process data.
            </p>

            <div className="space-y-6">
              {/* Industry */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Industry vertical
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "healthcare", label: "Healthcare" },
                    { value: "manufacturing", label: "Manufacturing" },
                    { value: "bfsi", label: "BFSI" },
                    { value: "professional", label: "Prof. Services" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setIndustry(opt.value); setCalculated(false); }}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        industry === opt.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Size */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Company size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(SIZE_MULTIPLIERS).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => { setSize(key); setCalculated(false); }}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        size === key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Processes */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Automatable processes identified: <span className="text-primary">{processes}</span>
                </label>
                <input
                  type="range"
                  min={3}
                  max={50}
                  value={processes}
                  onChange={(e) => { setProcesses(Number(e.target.value)); setCalculated(false); }}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>3 processes</span>
                  <span>50 processes</span>
                </div>
              </div>

              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setCalculated(true)}
              >
                Calculate My ROI
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right: Results */}
          <div>
            <div
              className={`rounded-2xl border p-8 transition-all duration-500 ${
                calculated
                  ? "border-primary bg-primary/5 shadow-[0_0_40px_rgba(72,230,200,0.15)]"
                  : "border-border bg-card opacity-60"
              }`}
            >
              <h3 className="text-xl font-bold mb-6 text-center">
                {calculated ? "Your Estimated ROI" : "Your results will appear here"}
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  {
                    label: "Investment Range",
                    value: calculated ? `$${(processValue / 1000).toFixed(0)}K–$${(processValue * 1.5 / 1000).toFixed(0)}K` : "—",
                    sub: "Implementation cost",
                  },
                  {
                    label: "Annual Savings",
                    value: calculated ? `$${(annualSavings / 1000).toFixed(0)}K` : "—",
                    sub: "Year 1 documented savings",
                  },
                  {
                    label: "First-Year ROI",
                    value: calculated ? `${roi}%` : "—",
                    sub: "Return on investment",
                  },
                  {
                    label: "Payback Period",
                    value: calculated ? `${paybackMonths} months` : "—",
                    sub: "Time to break even",
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="p-4 rounded-xl bg-background border border-border text-center"
                  >
                    <div className="text-2xl font-bold text-primary mb-1">{metric.value}</div>
                    <div className="text-xs font-semibold text-foreground">{metric.label}</div>
                    <div className="text-xs text-muted-foreground">{metric.sub}</div>
                  </div>
                ))}
              </div>

              {calculated && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground text-center">
                    Estimates based on industry benchmarks. A readiness assessment will refine these
                    numbers using your actual process data.
                  </p>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <a href="#assessment">
                      Start Your Free Readiness Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}

              {!calculated && (
                <p className="text-sm text-muted-foreground text-center">
                  Select your industry, company size, and number of processes above to estimate your ROI.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
