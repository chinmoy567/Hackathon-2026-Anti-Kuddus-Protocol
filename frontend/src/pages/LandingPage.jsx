import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { LandingNavbar } from "../components/landing/LandingNavbar.jsx";
import { Hero } from "../components/landing/Hero.jsx";
import { PortalCards } from "../components/landing/PortalCards.jsx";
import { Features } from "../components/landing/Features.jsx";
import { WorkflowTimeline } from "../components/landing/WorkflowTimeline.jsx";
import { Stats } from "../components/landing/Stats.jsx";
import { CtaSection } from "../components/landing/CtaSection.jsx";
import { LandingFooter } from "../components/landing/LandingFooter.jsx";

// Public marketing page; MotionConfig honours the user's reduced-motion setting.
export const LandingPage = () => {
  const { hash } = useLocation();

  // The page is lazy-loaded, so the browser's native anchor jump fires before
  // the sections exist — re-run the hash scroll once the page has mounted.
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="scroll-smooth bg-white antialiased">
        <LandingNavbar />
        <main>
          <Hero />
          <PortalCards />
          <Features />
          <WorkflowTimeline />
          <Stats />
          <CtaSection />
        </main>
        <LandingFooter />
      </div>
    </MotionConfig>
  );
};
