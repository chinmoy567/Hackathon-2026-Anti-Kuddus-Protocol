// Shared Framer Motion presets so every landing section animates consistently.
export const EASE_OUT = [0.22, 1, 0.36, 1];

// Fade + rise entrance used by most section content.
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

// Parent wrapper that staggers its fadeUp children.
export const staggerParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

// Trigger once, slightly before the element is fully in view.
export const viewportOnce = { once: true, margin: "-80px 0px" };
