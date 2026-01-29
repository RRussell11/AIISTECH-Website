import { Code2, Server, Cpu, Database, Shield } from "lucide-react";

export const Developers = () => {
  const techStack = [
    { icon: Code2, label: "Circuits", detail: "Circom & Groth16 for zk proofs" },
    { icon: Server, label: "Contracts", detail: "MTPI root contracts on-chain" },
    { icon: Cpu, label: "Proof Manager", detail: "Client-side verification layer" },
    { icon: Database, label: "Archivum", detail: "Prime-indexed audit storage" },
    { icon: Shield, label: "DIN-RPC", detail: "Decentralized identity network" },
  ];

  const codeSnippet = `// Verify a proof before state transition
import { ProofManager } from '@lambda-proof/core';

const proof = await ProofManager.generate({
  identity: userΞ₀,
  action: 'updateRecord',
  constraints: ethicalInvariants,
  witness: privateData
});

// Proof validated client-side
if (proof.isValid) {
  const receipt = await Archivum.commit(proof);
  console.log('Receipt:', receipt.primeIndex);
}`;

  return (
    <section id="developers" className="py-20 lg:py-32 bg-card/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Tech Stack */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Under the hood</h2>
            <p className="text-lg text-muted-foreground mb-8">
              ΛProof combines cutting-edge cryptography with practical developer tooling. Build
              proof-first systems without reinventing the stack.
            </p>

            <div className="space-y-3">
              {techStack.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:translate-x-2"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-lg border border-primary/30 bg-primary/5">
              <p className="text-sm text-foreground">
                <strong>Open source:</strong> Core libraries, circuits, and contracts available on
                GitHub.
              </p>
            </div>
          </div>

          {/* Right: Code Block */}
          <div>
            <div className="rounded-xl border border-border bg-[#0a0d1a] overflow-hidden">
              {/* Tabs */}
              <div className="flex items-center gap-1 px-4 py-3 border-b border-border bg-card/50">
                <div className="px-3 py-1.5 rounded-md bg-primary/10 text-xs font-medium text-primary">
                  proof-example.ts
                </div>
                <div className="px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  root-contract.sol
                </div>
              </div>

              {/* Code */}
              <div className="p-6 overflow-x-auto">
                <pre className="text-sm leading-relaxed">
                  <code className="text-foreground font-mono">
                    {codeSnippet.split("\n").map((line, i) => (
                      <div key={i} className="whitespace-pre">
                        {line.includes("//") ? (
                          <>
                            <span className="text-muted-foreground">{line.split("//")[0]}</span>
                            <span className="text-primary/70">// {line.split("//")[1]}</span>
                          </>
                        ) : line.includes("import") || line.includes("const") || line.includes("if") || line.includes("await") ? (
                          <span className="text-secondary">{line}</span>
                        ) : line.includes("identity:") || line.includes("action:") || line.includes("constraints:") ? (
                          <span className="text-primary">{line}</span>
                        ) : (
                          <span>{line}</span>
                        )}
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Client-side verification</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-sm text-muted-foreground">On-chain settlement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
