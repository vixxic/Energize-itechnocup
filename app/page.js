import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

// Landing Page
import Hero from "./landingPage/Hero/Hero";
import Problem from "./landingPage/Problem/Problem";
import Fitur from "./landingPage/Fitur/Fitur";
import HowItWorks from "./landingPage/HowItWorks/HowItWorks";
import CTA from "./landingPage/CTA/CTA";
import Impact from "./landingPage/Impact/Impact";

export default function Home() {
  return (
    <div>
      <Navbar />

      <Hero />
      <Problem />
      <Fitur />
      <HowItWorks />
      <CTA />
      <Impact />

      <Footer />
    </div>
  );
}
