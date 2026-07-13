import { Link } from "react-router-dom";
import { Siren, Globe, Send, Mail } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    heading: "Protocol",
    links: [
      { label: "Portals", href: "#portals" },
      { label: "Missions", href: "#missions" },
      { label: "How it works", href: "#workflow" },
      { label: "Impact", href: "#impact" },
    ],
  },
  {
    heading: "Missions",
    links: [
      { label: "Whistleblower", href: "#missions" },
      { label: "SOS Rescue Flare", href: "#missions" },
      { label: "Fact-Checker", href: "#missions" },
      { label: "Tiffin Ledger", href: "#missions" },
    ],
  },
];

const SOCIALS = [
  { label: "Project site", href: "https://github.com", icon: Globe },
  { label: "Community", href: "https://twitter.com", icon: Send },
  { label: "Email", href: "mailto:protocol@class7b.school", icon: Mail },
];

// Dark multi-column footer with brand, section links, and social icons.
export const LandingFooter = () => (
  <footer className="border-t border-white/10 bg-slate-950">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <a href="#top" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-slate-950">
              <Siren className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold tracking-tight text-white">
              Anti-Kuddus <span className="text-amber-400">Protocol</span>
            </span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            The school emergency SOS system of Class 7B — anonymous reporting,
            real-time rescue, and accountability that actually sticks.
          </p>
        </div>

        {FOOTER_COLUMNS.map(({ heading, links }) => (
          <nav key={heading} aria-label={heading}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{heading}</h3>
            <ul className="mt-4 space-y-2.5">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Stay in the loop</h3>
          <p className="mt-4 text-sm text-slate-400">
            Follow the protocol or drop the team a line.
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/40 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Anti-Kuddus Protocol · Class 7, Section B. All rights reserved.
        </p>
        <Link
          to="/login"
          className="text-xs font-semibold text-slate-400 transition-colors duration-200 hover:text-amber-300"
        >
          Enter the Protocol →
        </Link>
      </div>
    </div>
  </footer>
);
