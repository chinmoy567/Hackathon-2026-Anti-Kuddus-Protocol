import { useEffect, useState } from "react";
import { animate, useInView } from "framer-motion";

// Counts from 0 to `target` once the ref'd element scrolls into view.
export const useCountUp = (ref, target, { duration = 1.6 } = {}) => {
  const [value, setValue] = useState(0);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, target, duration]);

  return value;
};
