"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { useEffect } from "react";

function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", () => {});

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });

      lenis.destroy();
    };
  }, []);

  return null;
}

export default SmoothScroll;
