import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";

export const CTA = () => {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-gradient-to-b from-card/50 to-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[400px] bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-[120px]" />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-20 relative z-10">
        <div className="text-center space-y-8">
          {/* Heading */}
          <h2 className="text-3xl lg:text-5xl font-bold">
            Start building proof-first systems
          </h2>

          {/* Subtext */}
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the Web4 revolution. Build applications where lawfulness, sovereignty, and privacy
            are guaranteed by mathematics—not policy.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary group"
            >
              Request Collaboration
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="group">
              <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
              Join Builder List
            </Button>
          </div>

          {/* Use Cases */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Healthcare</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Banking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>+ More</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
