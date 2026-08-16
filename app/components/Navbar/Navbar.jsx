"use client";

import "./Navbar.css";
import { useEffect, useState, useSyncExternalStore } from "react";

import Link from "next/link";

// icons
import { GiHamburgerMenu } from "react-icons/gi";

const subscribe = (callback) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getSnapshot = () => Boolean(window.localStorage.getItem("analysis"));
const getServerSnapshot = () => false;

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const sudahAnalisis = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot,);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`navbar-outer  ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="nav-logo" />
          <p className="navbar-logo">Energize</p>
        </div>

        <ul className="nav-links">
          <a href="#home-section">
            <li className={`${scrolled ? "scrolled" : ""}`}>Beranda</li>
          </a>
          <a href="#problem-section">
            <li className={`${scrolled ? "scrolled" : ""}`}>Tantangan</li>
          </a>
          <a href="#fitur-section">
            <li className={`${scrolled ? "scrolled" : ""}`}>Fitur</li>
          </a>
          <a href="#how-it-works-section">
            <li className={`${scrolled ? "scrolled" : ""}`}>Cara Kerja</li>
          </a>
          <a href="#impact-section">
            <li className={`${scrolled ? "scrolled" : ""}`}>Dampak</li>
          </a>
        </ul>

        <div className="nav-hp">
          <div className={`analyze-btn ${scrolled ? "scrolled" : ""}`}>
            <Link href="/dashboard">
              <button className={`${scrolled ? "scrolled" : ""}`}>
                {sudahAnalisis ? "Dashboard" : "Analisis"}
              </button>
            </Link>
          </div>

          <button className="dropdown-btn-hp">
            <GiHamburgerMenu />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
