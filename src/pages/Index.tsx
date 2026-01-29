import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { WhatIsLambdaProof } from "@/components/WhatIsLambdaProof";
import { HowItWorks } from "@/components/HowItWorks";
import { Guarantees } from "@/components/Guarantees";
import { Protocols } from "@/components/Protocols";
import { Constitution } from "@/components/Constitution";
import { Developers } from "@/components/Developers";
import { WhoFor } from "@/components/WhoFor";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Problem />
        <WhatIsLambdaProof />
        <HowItWorks />
        <Guarantees />
        <Protocols />
        <Constitution />
        <Developers />
        <WhoFor />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
