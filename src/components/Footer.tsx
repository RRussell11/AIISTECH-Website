import { Github, Twitter, FileText } from "lucide-react";

export const Footer = () => {
  const whitepaperUrl =
    "https://citizengardens.org/wp-content/uploads/2025/11/Λproof-Whitepaper-1.pdf";

  const links = [
    { label: "Paper", href: whitepaperUrl, external: true },
    { label: "Docs", href: "#developers" },
    { label: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: FileText, href: whitepaperUrl, label: "Whitepaper", external: true },
  ];

  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Λ
            </span>
            <span className="text-xl font-semibold text-foreground">Proof</span>
          </div>

          {/* Center: Links */}
          <nav className="flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Social */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-9 h-9 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 flex items-center justify-center transition-all"
                aria-label={social.label}
                {...(social.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <social.icon className="w-4 h-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Ξ-Constitution</span>
            <span>•</span>
            <span>MTPI</span>
            <span>•</span>
            <span>Web4 Stack</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy & Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
