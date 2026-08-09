"use client";

import "./HowItWorks.css";
import { useLayoutEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function HowItWorks() {
  const sectionRef = useRef(null);
  const kabelRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const kabel = kabelRef.current;

      gsap.set(kabel, {
        scaleY: 0,
        transformOrigin: "top center",
      });

      gsap.set(".step-con", { opacity: 0, y: 30 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,

          start: "20% 70%",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      tl.to(kabel, {
        scaleY: 1,
        ease: "none",
        duration: 4,
      })
        .to(
          ".con1",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          1,
        )
        .to(
          ".con2",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          2,
        )
        .to(
          ".con3",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          3,
        )
        .to(
          ".con4",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          4,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="how-it-works-section">
      <h2>Bagaimana Kami Membantu</h2>

      <div ref={kabelRef} className="kabel"></div>

      <div className="step-con con1">
        <h3>01-Hubungkan Data</h3>
        <p>Masukkan informasi rumah dan perangkat listrik yang digunakan.</p>
      </div>

      <div className="step-con con2">
        <h3>02-Analisis Konsumsi</h3>
        <p>Sistem menghitung dan menganalisis pola penggunaan energi.</p>
      </div>

      <div className="step-con con3">
        <h3>03-Temukan Pemborosan</h3>
        <p>
          Identifikasi perangkat dan kebiasaan yang berkontribusi terhadap
          konsumsi tinggi.
        </p>
      </div>

      <div className="step-con con4">
        <h3>04-Ambil Tindakan</h3>
        <p>
          Dapatkan rekomendasi yang sesuai dengan kondisi penggunaan energi
          kamu.
        </p>
      </div>

      <div className="stop-contacts-div">
        <div className="circle"></div>
      </div>
    </div>
  );
}

export default HowItWorks;
