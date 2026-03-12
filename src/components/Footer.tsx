import { Linkedin, Twitter, Mail } from "lucide-react";

export const Footer = () => {
  const links = [
    { label: "Platform", href: "#platform" },
    { label: "Solutions", href: "#solutions" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "ROI Calculator", href: "#roi-calculator" },
    { label: "Sign In", href: "/login" },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "mailto:hello@aiistech.com", label: "Email" },
  ];

  return (
    <footer id="contact" className="border-t border-border py-12">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AIIS
            </span>
            <span className="text-xl font-semibold text-foreground">TECH</span>
          </div>

          {/* Center: Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
              >
                <social.icon className="w-4 h-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>Healthcare</span>
            <span>•</span>
            <span>Manufacturing</span>
            <span>•</span>
            <span>BFSI</span>
            <span>•</span>
            <span>Professional Services</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <span>•</span>
            <span>© 2026 AIISTECH. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
