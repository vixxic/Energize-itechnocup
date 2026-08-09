"use client";

import "./CTA.css";
import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function CTA() {
  const buttonRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      buttonRef.current,
      { boxShadow: "none" },
      {
        duration: 1,
        scale: 1.1,
        boxShadow: "0 0 10px #6c63ff, 0 0 20px #6c63ff, 0 0 40px #6c63ff",
        scrollTrigger: {
          trigger: buttonRef.current,

          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }, []);

  return (
    <div className="cta-section">
      <div className="following-kabel1 cta-kabel"></div>
      <div className="cta-main-con">
        <div className="cta-text-con">
          <p>Siap Memahami Penggunaan Energi Anda?</p>
          <p>
            Masukkan data rumah dan perangkat Anda untuk mendapatkan insight
            energi yang lebih personal.
          </p>
        </div>
        <div className="analisis-btn-cta-con ">
          <button ref={buttonRef}>Analisis Sekarang </button>
          <div className="following-kabel2 cta-kabel"></div>
        </div>
      </div>
    </div>
  );
}

export default CTA;
