"use client";

import "./Hero.css";
import { useEffect } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  useEffect(() => {
    const triggers = [];

    gsap.to(".layer1", {
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".home-section",
        start: "10% top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(".layer2", {
      y: 120,
      ease: "none",
      scrollTrigger: {
        trigger: ".home-section",
        start: "10% top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(".hero-text-con", {
      y: 120,
      ease: "none",
      scrollTrigger: {
        trigger: ".home-section",
        start: "10% top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(".layer3", {
      y: 250,
      ease: "none",
      scrollTrigger: {
        trigger: ".home-section",
        start: "10% top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="home-section">
      <div className="absolute-div">
        <div className="hero-text-con">
          <p>Pahami Energi Anda</p>
          <p>
            Kenali pola penggunaan listrik, temukan peluang penghematan, dan
            bangun kebiasaan energi yang lebih bijak.
          </p>
          <button className="analyze-btn-hero">Analisis Sekarang</button>
        </div>
        <img
          className="layer1"
          src="/parallax-effect/layer-1-parallax.png"
          alt="gunung"
        />
        <img
          className="layer2"
          src="/parallax-effect/layer-2-parallax.png"
          alt="rumah"
        />
        <img
          className="layer3"
          src="/parallax-effect/layer-3-parallax.png"
          alt="bukit"
        />
      </div>
    </div>
  );
}

export default Hero;
