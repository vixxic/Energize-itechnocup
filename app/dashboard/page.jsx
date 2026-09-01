"use client";

import { useContext, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Layout } from "antd";
const { Sider, Content, Footer } = Layout;

import { IoChevronBackOutline } from "react-icons/io5";

import "./dashboard.css";

import { DashboardContext } from "./context/DashboardContext";

// component
import BottomNav from "./components/BottomNav/BottomNav";
import SiderNav from "./components/SiderNav/SiderNav";

// halaman aplikatif
import FormContent from "./dashboardSection/FormContent/FormContent";
import DashboardContent from "./dashboardSection/DashboardContent/DashboardContent";
import ChallengeContent from "./dashboardSection/ChallengeContent/ChallengeContent";
import HistoryContent from "./dashboardSection/HistoryContent/HistoryContent";
import ProfileContent from "./dashboardSection/Profile/ProfileContent";

// halaman saat user belum melakukan analisis pertama
// halaman terkunci
function BlokirAnalisis({ setCurrentMenu }) {
  return (
    <div className="blokir-analisis">
      <img src="/lock-img.svg" alt="Fitur terkunci" width={100} height={80} />

      <h3>Fitur Belum Tersedia</h3>

      <p>Lakukan analisis energi untuk membuka fitur ini.</p>

      <button type="button" onClick={() => setCurrentMenu("analisis")}>
        Lakukan Analisis
      </button>
    </div>
  );
}

export default function Dashboard() {
  // agar halaman di page dashboard bisa di aksses lewat halaman landing page
  const searchParams = useSearchParams();
  const router = useRouter();

  const { currentMenu, setCurrentMenu, analysis, analysisLoading } =
    useContext(DashboardContext);

  const section = searchParams.get("section");

  // agar user bisa akses dari footer landing page ke dashboard
  useEffect(() => {
    if (!section) return;

    const validSections = [
      "dashboard",
      "analisis",
      "tantangan",
      "riwayat",
      "profil",
    ];

    if (validSections.includes(section)) {
      setCurrentMenu(section);
      router.replace("/dashboard");
    }
  }, [section, setCurrentMenu, router]);

  const terkunci = !analysis && currentMenu !== "analisis" && !analysisLoading;

  const renderContent = () => {
    if (currentMenu === "analisis") {
      return <FormContent />;
    }

    if (terkunci) {
      return <BlokirAnalisis setCurrentMenu={setCurrentMenu} />;
    }

    switch (currentMenu) {
      case "dashboard":
        return <DashboardContent />;

      case "tantangan":
        return <ChallengeContent />;

      case "riwayat":
        return <HistoryContent />;

      case "profil":
        return <ProfileContent />;

      default:
        return "404 Halaman Tidak Ditemukan";
    }
  };

  return (
    <Layout>
      <Sider className="sider-dashboard-con" width={280}>
        <SiderNav />
      </Sider>

      <Content className="content-dashboard">
        <Link href="/">
          <button className="back-to-landing-btn" type="button">
            <span>
              <IoChevronBackOutline />
            </span>
            Kembali ke beranda
          </button>
        </Link>

        {renderContent()}
      </Content>

      <Footer className="bottom-nav-dashboard">
        <BottomNav />
      </Footer>
    </Layout>
  );
}
