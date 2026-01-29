<?php
/*
Template Name: ΛProof Landing Page
Description: Static WordPress template that mirrors the ΛProof landing experience from the SPA build.
Template Post Type: page
*/

get_header();

$lambda_asset_base = trailingslashit( get_template_directory_uri() ) . 'lambda-proof';
?>

<style>
  :root {
    --lp-background: #02030a;
    --lp-foreground: #f9fafb;
    --lp-card: #050816;
    --lp-border: #20263a;
    --lp-primary: #48e6c8;
    --lp-secondary: #c954ff;
    --lp-muted: #9ca3af;
    --lp-container: 1280px;
    --lp-radius: 16px;
    --lp-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  @media (prefers-color-scheme: light) {
    :root {
      --lp-background: #f6f7fb;
      --lp-foreground: #0f172a;
      --lp-card: #ffffff;
      --lp-border: #d6dae5;
    }
  }

  .lp-page {
    background: radial-gradient(ellipse at bottom left, rgba(72, 230, 200, 0.08) 0%, transparent 45%),
                radial-gradient(ellipse at top right, rgba(201, 84, 255, 0.06) 0%, transparent 45%),
                var(--lp-background);
    color: var(--lp-foreground);
    font-family: var(--lp-font);
    padding-top: 80px;
  }

  .lp-container {
    width: 100%;
    max-width: var(--lp-container);
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .lp-section {
    padding: 80px 0;
  }

  .lp-grid {
    display: grid;
    gap: 32px;
  }

  .lp-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 999px;
    border: 1px solid rgba(72, 230, 200, 0.3);
    background: rgba(72, 230, 200, 0.05);
    color: var(--lp-primary);
    font-weight: 600;
    font-size: 14px;
  }

  .lp-heading {
    font-size: clamp(28px, 4vw, 52px);
    line-height: 1.1;
    font-weight: 800;
  }

  .lp-subhead {
    font-size: 18px;
    color: var(--lp-muted);
    line-height: 1.6;
  }

  .lp-card {
    border: 1px solid var(--lp-border);
    background: var(--lp-card);
    border-radius: var(--lp-radius);
    padding: 24px;
  }

  .lp-icon-chip {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(72, 230, 200, 0.12);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--lp-primary);
  }

  .lp-icon-chip.small {
    width: 40px;
    height: 40px;
  }

  .lp-icon-chip.secondary {
    background: rgba(201, 84, 255, 0.12);
    color: var(--lp-secondary);
  }

  .lp-icon {
    width: 22px;
    height: 22px;
    stroke: currentColor;
    stroke-width: 1.8;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .lp-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 20px;
    border-radius: 12px;
    border: 1px solid transparent;
    font-weight: 600;
    text-decoration: none;
    transition: transform 150ms ease, box-shadow 150ms ease, background 150ms ease, color 150ms ease;
    cursor: pointer;
  }

  .lp-button.primary {
    background: var(--lp-primary);
    color: #041016;
    box-shadow: 0 10px 30px rgba(72, 230, 200, 0.35);
  }

  .lp-button.primary:hover { transform: translateY(-1px); }

  .lp-button.outline {
    border-color: var(--lp-border);
    color: var(--lp-foreground);
    background: transparent;
  }

  .lp-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    color: var(--lp-muted);
    font-size: 14px;
  }

  .lp-badge-row span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .lp-badge-row .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--lp-primary);
  }

  .lp-hero {
    position: relative;
    min-height: 90vh;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .lp-hero::before,
  .lp-hero::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.35;
  }

  .lp-hero::before {
    width: 320px;
    height: 320px;
    background: var(--lp-primary);
    top: 10%;
    left: 5%;
  }

  .lp-hero::after {
    width: 420px;
    height: 420px;
    background: var(--lp-secondary);
    bottom: 10%;
    right: 5%;
  }

  .lp-hero-content {
    position: relative;
    display: grid;
    gap: 32px;
  }

  @media (min-width: 992px) {
    .lp-hero-content { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  .lp-hero-image {
    position: relative;
    border: 1px solid rgba(72, 230, 200, 0.3);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 0 40px rgba(72, 230, 200, 0.15);
  }

  .lp-hero-image img {
    display: block;
    width: 100%;
    height: auto;
  }

  .lp-floating-label {
    position: absolute;
    padding: 10px 14px;
    border-radius: 12px;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(5, 8, 22, 0.7);
    font-size: 13px;
    font-weight: 600;
  }

  .lp-floating-label.primary { left: -12px; top: 22%; color: var(--lp-primary); }
  .lp-floating-label.secondary { right: -12px; bottom: 22%; color: var(--lp-secondary); }

  /* Section specific helpers */
  .lp-section-header { text-align: center; margin-bottom: 48px; }
  .lp-section-header h2 { font-size: clamp(26px, 3vw, 38px); margin-bottom: 12px; }
  .lp-section-header p { color: var(--lp-muted); max-width: 720px; margin: 0 auto; }

  .lp-columns-3 { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
  .lp-columns-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }

  .lp-checklist { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
  .lp-checklist li { display: flex; gap: 10px; color: var(--lp-muted); }
  .lp-checklist .bullet { width: 8px; height: 8px; border-radius: 999px; background: var(--lp-primary); margin-top: 8px; }

  .lp-code-block {
    background: #0a0d1a;
    border: 1px solid var(--lp-border);
    border-radius: 16px;
    overflow: hidden;
  }

  .lp-code-tabs { display: flex; gap: 8px; padding: 12px 18px; border-bottom: 1px solid var(--lp-border); background: rgba(255,255,255,0.02); }
  .lp-code-tab { padding: 8px 12px; border-radius: 10px; font-size: 12px; font-weight: 600; }
  .lp-code-tab.active { background: rgba(72, 230, 200, 0.14); color: var(--lp-primary); }
  .lp-code-body { padding: 24px; overflow-x: auto; font-family: 'SFMono-Regular', ui-monospace, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; color: #e5e7eb; line-height: 1.6; }

  .lp-taglist { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; color: var(--lp-muted); }
  .lp-taglist .dot { width: 6px; height: 6px; border-radius: 999px; background: var(--lp-primary); }

  .lp-footer-row { display: flex; flex-direction: column; gap: 16px; align-items: center; text-align: center; color: var(--lp-muted); font-size: 13px; }
  @media (min-width: 768px) { .lp-footer-row { flex-direction: row; justify-content: space-between; text-align: left; } }
</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

<div class="lp-page">
  <div class="lp-container">
    <header style="position: sticky; top: 0; z-index: 10; backdrop-filter: blur(14px); background: rgba(5,8,22,0.7); border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; margin: 24px 0; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size: 24px; font-weight: 800; background: linear-gradient(90deg, var(--lp-primary), var(--lp-secondary)); -webkit-background-clip: text; color: transparent;">Λ</span>
        <span style="font-size: 18px; font-weight: 700;">Proof</span>
      </div>
      <nav style="display:flex; gap:18px; align-items:center; font-size:14px;">
        <a href="#hero" style="color:var(--lp-muted); text-decoration:none;">Overview</a>
        <a href="#how-it-works" style="color:var(--lp-muted); text-decoration:none;">How it Works</a>
        <a href="#protocols" style="color:var(--lp-muted); text-decoration:none;">Protocols</a>
        <a href="#developers" style="color:var(--lp-muted); text-decoration:none;">Developers</a>
        <a href="https://citizengardens.org/wp-content/uploads/2025/11/Λproof-Whitepaper-1.pdf" style="color:var(--lp-muted); text-decoration:none;">Paper</a>
      </nav>
      <div style="display:flex; gap:10px;">
        <a class="lp-button outline" href="https://citizengardens.org/wp-content/uploads/2025/11/Λproof-Whitepaper-1.pdf">Read the Paper</a>
        <a class="lp-button primary" href="#contact">Contact</a>
      </div>
    </header>
  </div>

  <section id="hero" class="lp-section lp-hero">
    <div class="lp-container lp-hero-content">
      <div style="display:flex; flex-direction:column; gap:18px; position: relative; z-index:2;">
        <div class="lp-pill">Introducing ΛProof</div>
        <h1 class="lp-heading">Proof-first personal computing for <span style="background: linear-gradient(90deg, var(--lp-primary), var(--lp-secondary)); -webkit-background-clip: text; color: transparent;">Web4</span></h1>
        <p class="lp-subhead">Every state transition must prove it is lawful, ethically constrained, and user-sovereign. No surveillance. No hidden drift. Only verifiable receipts.</p>
        <div style="display:flex; flex-wrap:wrap; gap:12px;">
          <a class="lp-button primary" href="https://citizengardens.org/wp-content/uploads/2025/11/Λproof-Whitepaper-1.pdf">Read the ΛProof Paper</a>
          <a class="lp-button outline" href="#developers">Start Building</a>
        </div>
        <div class="lp-badge-row">
          <span><span class="dot"></span>Zero surveillance</span>
          <span><span class="dot"></span>Ethical invariants</span>
          <span><span class="dot"></span>Quantum-ready</span>
        </div>
      </div>
      <div style="position: relative; z-index:2;">
        <div class="lp-hero-image">
          <img src="<?php echo esc_url( $lambda_asset_base . '/hero-visual.svg' ); ?>" alt="ΛProof proof pipeline visualization">
          <span class="lp-floating-label primary">Identity → Proof</span>
          <span class="lp-floating-label secondary">Archivum</span>
        </div>
      </div>
    </div>
  </section>

  <section class="lp-section" style="background: rgba(255,255,255,0.02);">
    <div class="lp-container">
      <div class="lp-section-header">
        <h2>Why trust-based systems are failing</h2>
        <p>Our digital infrastructure runs on surveillance, opacity, and soft guarantees. Users must trust platforms to behave correctly—but trust is not verifiable.</p>
      </div>
      <div class="lp-grid lp-columns-3">
        <div class="lp-card">
          <div class="lp-icon-chip" aria-hidden="true" style="margin-bottom:10px;">
            <svg class="lp-icon" viewBox="0 0 24 24" focusable="false">
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <h3 style="font-size:20px; margin-bottom:8px;">Surveillance defaults</h3>
          <p class="lp-subhead" style="font-size:15px;">Data collected 'just in case,' monetized without consent, deanonymized at will.</p>
        </div>
        <div class="lp-card">
          <div class="lp-icon-chip" aria-hidden="true" style="margin-bottom:10px;">
            <svg class="lp-icon" viewBox="0 0 24 24" focusable="false">
              <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
              <polyline points="16 17 22 17 22 11"></polyline>
            </svg>
          </div>
          <h3 style="font-size:20px; margin-bottom:8px;">Unbounded drift</h3>
          <p class="lp-subhead" style="font-size:15px;">Algorithms update silently, models retrain without provenance, behavior changes invisibly.</p>
        </div>
        <div class="lp-card">
          <div class="lp-icon-chip" aria-hidden="true" style="margin-bottom:10px;">
            <svg class="lp-icon" viewBox="0 0 24 24" focusable="false">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" x2="12" y1="8" y2="12"></line>
              <line x1="12" x2="12.01" y1="16" y2="16"></line>
            </svg>
          </div>
          <h3 style="font-size:20px; margin-bottom:8px;">Opaque governance</h3>
          <p class="lp-subhead" style="font-size:15px;">Terms of service as law, decisions made behind closed doors, no verifiable enforcement.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="lp-section">
    <div class="lp-container">
      <div class="lp-grid" style="gap:48px;">
        <div style="display:flex; flex-direction:column; gap:16px;">
          <h2>What is ΛProof?</h2>
          <p class="lp-subhead">ΛProof is an architectural pattern and protocol stack for building proof-first digital systems. Instead of trusting institutions, we trust proofs. Instead of collecting data, we collect lawful receipts.</p>
          <p class="lp-subhead">Every state transition in a ΛProof system must be accompanied by a cryptographic proof that the transition is lawful, ethically constrained, and user-sovereign.</p>
          <ul class="lp-checklist">
            <li><span class="bullet"></span><span><strong style="color:var(--lp-foreground);">Zero-knowledge proofs</strong> verify correctness without exposing data</span></li>
            <li><span class="bullet"></span><span><strong style="color:var(--lp-foreground);">Prime-indexing</strong> enables composition without drift</span></li>
            <li><span class="bullet"></span><span><strong style="color:var(--lp-foreground);">Ethical invariants</strong> are encoded and enforced mathematically</span></li>
          </ul>
        </div>
        <div class="lp-grid" style="gap:16px;">
          <div class="lp-card">
            <h3 style="margin-bottom:6px;">MTPI – Meta-Theorem of Prime Identity</h3>
            <p class="lp-subhead" style="font-size:14px;">Models users and systems as prime-indexed identities that compose without hidden drift.</p>
          </div>
          <div class="lp-card">
            <h3 style="margin-bottom:6px;">PLICs – Prime-Lawful Invariant Contracts</h3>
            <p class="lp-subhead" style="font-size:14px;">Smart contracts that enforce ethical constraints and bounded behavior mathematically.</p>
          </div>
          <div class="lp-card">
            <h3 style="margin-bottom:6px;">CSL – Conscious Sovereignty Layer</h3>
            <p class="lp-subhead" style="font-size:14px;">Users maintain provable control over identity, capabilities, and consent.</p>
          </div>
          <div class="lp-card">
            <h3 style="margin-bottom:6px;">Archivum – Proof-only Audit Layer</h3>
            <p class="lp-subhead" style="font-size:14px;">Prime-indexed receipts create verifiable history without exposing raw data.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="how-it-works" class="lp-section" style="background: rgba(255,255,255,0.02);">
    <div class="lp-container">
      <div class="lp-section-header">
        <h2>How ΛProof works</h2>
        <p>Every action must prove it is lawful before it exists. Three steps guarantee this.</p>
      </div>
      <div class="lp-grid lp-columns-3">
        <div class="lp-card">
          <div style="font-size:12px; font-weight:700; color:var(--lp-primary); margin-bottom:6px;">STEP 1</div>
          <h3 style="font-size:20px; margin-bottom:8px;">Prime Identity (Ξ₀)</h3>
          <p class="lp-subhead" style="font-size:14px;">Every user starts with a genesis state—a prime-indexed identity that serves as the root of all future proofs.</p>
          <p style="font-size:13px; color:var(--lp-muted); font-style: italic; border-left: 2px solid rgba(72,230,200,0.3); padding-left: 10px;">Ξ₀ is your cryptographic anchor. All actions trace back to this immutable origin.</p>
        </div>
        <div class="lp-card">
          <div style="font-size:12px; font-weight:700; color:var(--lp-primary); margin-bottom:6px;">STEP 2</div>
          <h3 style="font-size:20px; margin-bottom:8px;">Client-side zk Proofs</h3>
          <p class="lp-subhead" style="font-size:14px;">Before any RPC call or state change, your client generates a cryptographic proof using Circom circuits and Groth16.</p>
          <p style="font-size:13px; color:var(--lp-muted); font-style: italic; border-left: 2px solid rgba(72,230,200,0.3); padding-left: 10px;">Proofs verify lawfulness without exposing private data. Computation happens locally.</p>
        </div>
        <div class="lp-card">
          <div style="font-size:12px; font-weight:700; color:var(--lp-primary); margin-bottom:6px;">STEP 3</div>
          <h3 style="font-size:20px; margin-bottom:8px;">Archivum &amp; Lawful Gates</h3>
          <p class="lp-subhead" style="font-size:14px;">The proof is validated by the RootContract. If lawful, a prime-indexed receipt is stored in Archivum.</p>
          <p style="font-size:13px; color:var(--lp-muted); font-style: italic; border-left: 2px solid rgba(72,230,200,0.3); padding-left: 10px;">Every action creates an auditable, tamper-proof record—but only of proofs, not data.</p>
        </div>
      </div>
      <div class="lp-card" style="margin-top:32px; text-align:center; background: rgba(72,230,200,0.05); border-color: rgba(72,230,200,0.35);">
        <p style="font-size:14px;">The result: A system where every action is provably lawful, auditable, and user-sovereign—without surveillance.</p>
      </div>
    </div>
  </section>

  <section class="lp-section">
    <div class="lp-container">
      <div class="lp-section-header">
        <h2>What ΛProof guarantees</h2>
        <p>Four core guarantees ensure your systems are verifiable, ethical, and user-first.</p>
      </div>
      <div class="lp-grid lp-columns-2">
        <div class="lp-card">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <span style="font-size:12px; color:var(--lp-primary); font-weight:700;">GUARANTEE 01</span>
            <span class="lp-icon-chip small" aria-hidden="true">
              <svg class="lp-icon" viewBox="0 0 24 24" focusable="false">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M8 16H3v5"></path>
              </svg>
            </span>
          </div>
          <h3 style="font-size:20px; margin-bottom:6px;">Prime-lawful recursion</h3>
          <p class="lp-subhead" style="font-size:14px;">Every state transition is verifiably derived from a prime-indexed identity. No hidden state, no drift.</p>
        </div>
        <div class="lp-card">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <span style="font-size:12px; color:var(--lp-primary); font-weight:700;">GUARANTEE 02</span>
            <span class="lp-icon-chip small" aria-hidden="true">
              <svg class="lp-icon" viewBox="0 0 24 24" focusable="false">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
              </svg>
            </span>
          </div>
          <h3 style="font-size:20px; margin-bottom:6px;">Ethical invariants</h3>
          <p class="lp-subhead" style="font-size:14px;">All actions must commute with mathematically encoded ethical constraints. Violations are rejected at proof-time.</p>
        </div>
        <div class="lp-card">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <span style="font-size:12px; color:var(--lp-primary); font-weight:700;">GUARANTEE 03</span>
            <span class="lp-icon-chip small" aria-hidden="true">
              <svg class="lp-icon" viewBox="0 0 24 24" focusable="false">
                <rect width="20" height="5" x="2" y="3" rx="1"></rect>
                <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
                <path d="M10 12h4"></path>
              </svg>
            </span>
          </div>
          <h3 style="font-size:20px; margin-bottom:6px;">Audit without surveillance</h3>
          <p class="lp-subhead" style="font-size:14px;">Archivum stores cryptographic receipts, not raw data. Regulators verify compliance without accessing private information.</p>
        </div>
        <div class="lp-card">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <span style="font-size:12px; color:var(--lp-primary); font-weight:700;">GUARANTEE 04</span>
            <span class="lp-icon-chip small" aria-hidden="true">
              <svg class="lp-icon" viewBox="0 0 24 24" focusable="false">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
          </div>
          <h3 style="font-size:20px; margin-bottom:6px;">User sovereignty</h3>
          <p class="lp-subhead" style="font-size:14px;">You control your identity, capabilities, and consent. Permissions are provable, scoped, and revocable.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="protocols" class="lp-section" style="background: rgba(255,255,255,0.02);">
    <div class="lp-container">
      <div class="lp-section-header">
        <h2>What you can build today</h2>
        <p>Protocols live on ΛProof. Start building proof-first systems for real-world use cases.</p>
      </div>
      <div class="lp-grid lp-columns-3">
        <div class="lp-card">
          <h3 style="font-size:22px; margin-bottom:12px;">Healthcare</h3>
          <ul class="lp-checklist">
            <li><span class="bullet"></span><span>Patient records stay client-side</span></li>
            <li><span class="bullet"></span><span>Diagnoses verified by zk proofs</span></li>
            <li><span class="bullet"></span><span>Compliance auditable without data exposure</span></li>
          </ul>
          <div style="margin-top:18px; font-size:14px; color:var(--lp-primary); display:inline-flex; gap:8px; align-items:center;">Learn more →</div>
        </div>
        <div class="lp-card">
          <h3 style="font-size:22px; margin-bottom:12px;">Banking &amp; Payments</h3>
          <ul class="lp-checklist">
            <li><span class="bullet"></span><span>Transactions prove lawfulness before settlement</span></li>
            <li><span class="bullet"></span><span>KYC/AML enforced via proofs, not surveillance</span></li>
            <li><span class="bullet"></span><span>Cross-border compliance without intermediaries</span></li>
          </ul>
          <div style="margin-top:18px; font-size:14px; color:var(--lp-primary); display:inline-flex; gap:8px; align-items:center;">Learn more →</div>
        </div>
        <div class="lp-card">
          <h3 style="font-size:22px; margin-bottom:12px;">AI &amp; Research</h3>
          <ul class="lp-checklist">
            <li><span class="bullet"></span><span>Model outputs provably aligned with constraints</span></li>
            <li><span class="bullet"></span><span>Training data never leaves source</span></li>
            <li><span class="bullet"></span><span>Research collaboration without data sharing</span></li>
          </ul>
          <div style="margin-top:18px; font-size:14px; color:var(--lp-primary); display:inline-flex; gap:8px; align-items:center;">Learn more →</div>
        </div>
      </div>
    </div>
  </section>

  <section class="lp-section" id="paper">
    <div class="lp-container">
      <div class="lp-grid" style="gap:48px; align-items: center;">
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div class="lp-pill" style="border-color: rgba(201,84,255,0.3); color: var(--lp-secondary); background: rgba(201,84,255,0.05);">The Foundation</div>
          <h2>The Ξ-Constitution</h2>
          <p class="lp-subhead">The Ξ-Constitution is the mathematical law of ΛProof. It defines the invariants that all systems must satisfy to be considered lawful, sovereign, and proof-first.</p>
          <p class="lp-subhead">These principles are not policy documents—they are mathematically enforced constraints that govern recursion, identity, and state transitions in the ΛProof stack.</p>
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:30px; font-weight:800; background: linear-gradient(90deg, var(--lp-primary), var(--lp-secondary)); -webkit-background-clip: text; color: transparent;">Ξ</span>
            <span style="color:var(--lp-muted);">The symbol of constitutional law in Web4</span>
          </div>
        </div>
        <div class="lp-grid" style="gap:14px;">
          <div class="lp-card">
            <div style="display:flex; gap:12px; align-items:flex-start;">
              <div style="width:44px; height:44px; border-radius:12px; background: rgba(201,84,255,0.12); color: var(--lp-secondary); display:flex; align-items:center; justify-content:center; font-weight:700;">1</div>
              <div>
                <h3 style="margin-bottom:6px;">Prime-indexability</h3>
                <p class="lp-subhead" style="font-size:14px;">Every identity, action, and state must be decomposable into prime-indexed components. No hidden composition.</p>
              </div>
            </div>
          </div>
          <div class="lp-card">
            <div style="display:flex; gap:12px; align-items:flex-start;">
              <div style="width:44px; height:44px; border-radius:12px; background: rgba(201,84,255,0.12); color: var(--lp-secondary); display:flex; align-items:center; justify-content:center; font-weight:700;">2</div>
              <div>
                <h3 style="margin-bottom:6px;">Recursive decodability</h3>
                <p class="lp-subhead" style="font-size:14px;">Any observer with appropriate keys can verify the lawfulness of a proof without reconstructing private data.</p>
              </div>
            </div>
          </div>
          <div class="lp-card">
            <div style="display:flex; gap:12px; align-items:flex-start;">
              <div style="width:44px; height:44px; border-radius:12px; background: rgba(201,84,255,0.12); color: var(--lp-secondary); display:flex; align-items:center; justify-content:center; font-weight:700;">3</div>
              <div>
                <h3 style="margin-bottom:6px;">Identity persistence</h3>
                <p class="lp-subhead" style="font-size:14px;">Prime identities are immutable. All changes must be provably derived from Ξ₀ through lawful transitions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="developers" class="lp-section" style="background: rgba(255,255,255,0.02);">
    <div class="lp-container">
      <div class="lp-grid" style="gap:48px;">
        <div>
          <h2>Under the hood</h2>
          <p class="lp-subhead" style="margin-bottom:24px;">ΛProof combines cutting-edge cryptography with practical developer tooling. Build proof-first systems without reinventing the stack.</p>
          <div class="lp-grid" style="gap:12px;">
            <div class="lp-card" style="display:flex; gap:12px; align-items:center;">
              <div class="lp-icon-chip" aria-hidden="true">
                <svg class="lp-icon" viewBox="0 0 24 24" focusable="false">
                  <path d="m18 16 4-4-4-4"></path>
                  <path d="m6 8-4 4 4 4"></path>
                  <path d="m14.5 4-5 16"></path>
                </svg>
              </div>
              <div><div style="font-weight:600; font-size:14px;">Circuits</div><div style="color:var(--lp-muted); font-size:12px;">Circom &amp; Groth16 for zk proofs</div></div>
            </div>
            <div class="lp-card" style="display:flex; gap:12px; align-items:center;">
              <div class="lp-icon-chip" aria-hidden="true">
                <svg class="lp-icon" viewBox="0 0 24 24" focusable="false">
                  <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
                  <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
                  <line x1="6" x2="6.01" y1="6" y2="6"></line>
                  <line x1="6" x2="6.01" y1="18" y2="18"></line>
                </svg>
              </div>
              <div><div style="font-weight:600; font-size:14px;">Contracts</div><div style="color:var(--lp-muted); font-size:12px;">MTPI root contracts on-chain</div></div>
            </div>
            <div class="lp-card" style="display:flex; gap:12px; align-items:center;">
              <div class="lp-icon-chip" aria-hidden="true">
                <svg class="lp-icon" viewBox="0 0 24 24" focusable="false">
                  <rect width="16" height="16" x="4" y="4" rx="2"></rect>
                  <rect width="6" height="6" x="9" y="9" rx="1"></rect>
                  <path d="M15 2v2"></path>
                  <path d="M15 20v2"></path>
                  <path d="M2 15h2"></path>
                  <path d="M2 9h2"></path>
                  <path d="M20 15h2"></path>
                  <path d="M20 9h2"></path>
                  <path d="M9 2v2"></path>
                  <path d="M9 20v2"></path>
                </svg>
              </div>
              <div><div style="font-weight:600; font-size:14px;">Proof Manager</div><div style="color:var(--lp-muted); font-size:12px;">Client-side verification layer</div></div>
            </div>
            <div class="lp-card" style="display:flex; gap:12px; align-items:center;">
              <div class="lp-icon-chip" aria-hidden="true">
                <svg class="lp-icon" viewBox="0 0 24 24" focusable="false">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
                  <path d="M3 12A9 3 0 0 0 21 12"></path>
                </svg>
              </div>
              <div><div style="font-weight:600; font-size:14px;">Archivum</div><div style="color:var(--lp-muted); font-size:12px;">Prime-indexed audit storage</div></div>
            </div>
            <div class="lp-card" style="display:flex; gap:12px; align-items:center;">
              <div class="lp-icon-chip" aria-hidden="true">
                <svg class="lp-icon" viewBox="0 0 24 24" focusable="false">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                </svg>
              </div>
              <div><div style="font-weight:600; font-size:14px;">DIN-RPC</div><div style="color:var(--lp-muted); font-size:12px;">Decentralized identity network</div></div>
            </div>
          </div>
          <div class="lp-card" style="margin-top:16px; border-color: rgba(72,230,200,0.35); background: rgba(72,230,200,0.05);">
            <p style="font-size:14px;">Open source: Core libraries, circuits, and contracts available on GitHub.</p>
          </div>
        </div>
        <div>
          <div class="lp-code-block">
            <div class="lp-code-tabs">
              <span class="lp-code-tab active">proof-example.ts</span>
              <span class="lp-code-tab" style="color:var(--lp-muted);">root-contract.sol</span>
            </div>
            <div class="lp-code-body">
              <pre style="margin:0; white-space:pre;"><code>// Verify a proof before state transition
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
}</code></pre>
            </div>
          </div>
          <div style="display:flex; gap:16px; flex-wrap:wrap; margin-top:14px; color:var(--lp-muted); font-size:13px;">
            <span style="display:flex; align-items:center; gap:8px;"><span class="dot"></span>Client-side verification</span>
            <span style="display:flex; align-items:center; gap:8px;"><span class="dot"></span>On-chain settlement</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="lp-section">
    <div class="lp-container">
      <div class="lp-section-header">
        <h2>Who is ΛProof for?</h2>
        <p>ΛProof serves everyone building, regulating, or researching the future of digital systems.</p>
      </div>
      <div class="lp-grid lp-columns-3">
        <div class="lp-card" style="text-align:center;">
          <h3 style="font-size:20px; margin-bottom:10px;">Builders &amp; protocol teams</h3>
          <p class="lp-subhead" style="font-size:14px;">Build the next generation of Web4 applications with proof-first architecture. Access tools, circuits, and reference implementations.</p>
        </div>
        <div class="lp-card" style="text-align:center;">
          <h3 style="font-size:20px; margin-bottom:10px;">Institutions &amp; regulators</h3>
          <p class="lp-subhead" style="font-size:14px;">Verify compliance and audit systems without accessing private data. ΛProof enables lawful governance without surveillance.</p>
        </div>
        <div class="lp-card" style="text-align:center;">
          <h3 style="font-size:20px; margin-bottom:10px;">Researchers &amp; communities</h3>
          <p class="lp-subhead" style="font-size:14px;">Explore cryptographic primitives, ethical constraints, and proof systems. Contribute to the future of sovereign computing.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="lp-section" style="position: relative; overflow:hidden; background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);">
    <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none;">
      <div style="width:800px; height:400px; background: radial-gradient(circle at 30% 50%, rgba(72,230,200,0.18), transparent 55%), radial-gradient(circle at 70% 50%, rgba(201,84,255,0.14), transparent 55%); filter: blur(90px);"></div>
    </div>
    <div class="lp-container" style="position: relative; z-index:1;">
      <div style="text-align:center; display:flex; flex-direction:column; gap:16px; align-items:center;">
        <h2 class="lp-heading" style="font-size: clamp(30px, 4vw, 48px);">Start building proof-first systems</h2>
        <p class="lp-subhead" style="max-width: 760px;">Join the Web4 revolution. Build applications where lawfulness, sovereignty, and privacy are guaranteed by mathematics—not policy.</p>
        <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-top:6px;">
          <a class="lp-button primary" href="mailto:info@citizengardens.org">Request Collaboration</a>
          <a class="lp-button outline" href="#">Join Builder List</a>
        </div>
        <div class="lp-taglist" style="margin-top:10px;">
          <span style="display:flex; align-items:center; gap:6px;"><span class="dot"></span>Healthcare</span>
          <span style="display:flex; align-items:center; gap:6px;"><span class="dot"></span>Banking</span>
          <span style="display:flex; align-items:center; gap:6px;"><span class="dot"></span>AI</span>
          <span style="display:flex; align-items:center; gap:6px;"><span class="dot"></span>+ More</span>
        </div>
      </div>
    </div>
  </section>

  <footer class="lp-section" style="border-top: 1px solid var(--lp-border); padding-bottom: 40px;">
    <div class="lp-container">
      <div style="display:flex; flex-direction:column; gap:20px; align-items:center; text-align:center;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size: 24px; font-weight: 800; background: linear-gradient(90deg, var(--lp-primary), var(--lp-secondary)); -webkit-background-clip: text; color: transparent;">Λ</span>
          <span style="font-size: 18px; font-weight: 700;">Proof</span>
        </div>
        <nav style="display:flex; gap:18px; flex-wrap:wrap; justify-content:center;">
          <a href="https://citizengardens.org/wp-content/uploads/2025/11/Λproof-Whitepaper-1.pdf" style="color:var(--lp-muted); text-decoration:none; font-size:14px;">Paper</a>
          <a href="#developers" style="color:var(--lp-muted); text-decoration:none; font-size:14px;">Docs</a>
          <a href="#contact" style="color:var(--lp-muted); text-decoration:none; font-size:14px;">Contact</a>
        </nav>
        <div class="lp-footer-row">
          <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; justify-content:center;">
            <span>Ξ-Constitution</span><span>•</span><span>MTPI</span><span>•</span><span>Web4 Stack</span>
          </div>
          <div><a href="#" style="color:var(--lp-muted); text-decoration:none;">Privacy &amp; Terms</a></div>
        </div>
      </div>
    </div>
  </footer>
</div>

<?php get_footer(); ?>
