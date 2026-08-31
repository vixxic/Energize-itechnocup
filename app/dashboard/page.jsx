"use client";

import { useEffect, useContext } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import "./dashboard.css";

import { DashboardContext } from "./context/DashboardContext";

import Link from "next/link";

import { IoChevronBackOutline } from "react-icons/io5";

// components
import BottomNav from "./components/BottomNav/BottomNav";
import SiderNav from "./components/SiderNav/SiderNav";

import FormContent from "./dashboardSection/FormContent/FormContent";
import DashboardContent from "./dashboardSection/DashboardContent/DashboardContent";
import ChallengeContent from "./dashboardSection/ChallengeContent/ChallengeContent";
import HistoryContent from "./dashboardSection/HistoryContent/HistoryContent";
import ProfileContent from "./dashboardSection/Profile/ProfileContent";

import { Layout } from "antd";

const { Sider, Content, Footer } = Layout;

function BlokirAnalisis({ setCurrentMenu }) {
  return (
    <div className="blokir-analisis">
      <img src="/lock-img.svg" alt="lock-img" width={100} height={80} />

      <h3>Fitur Belum Tersedia</h3>

      <p>Lakukan analisis energi untuk membuka fitur ini.</p>

      <button type="button" onClick={() => setCurrentMenu("analisis")}>
        Lakukan Analisis
      </button>
    </div>
  );
}

function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { currentMenu, setCurrentMenu, analysis, analysisLoading } =
    useContext(DashboardContext);

  const section = searchParams.get("section");

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

  return (
    <Layout>
      <Sider className="sider-dashboard-con" width={280}>
        <SiderNav />
      </Sider>

      <Content className="content-dashboard">
        <Link href="/">
          <button className="back-to-landing-btn">
            <span>
              <IoChevronBackOutline />
            </span>
            Kembali ke beranda
          </button>
        </Link>

        {currentMenu === "analisis" ? (
          <FormContent />
        ) : terkunci ? (
          <BlokirAnalisis setCurrentMenu={setCurrentMenu} />
        ) : currentMenu === "dashboard" ? (
          <DashboardContent />
        ) : currentMenu === "tantangan" ? (
          <ChallengeContent />
        ) : currentMenu === "riwayat" ? (
          <HistoryContent />
        ) : currentMenu === "profil" ? (
          <ProfileContent />
        ) : (
          "404 Halaman Tidak di Temukan"
        )}
      </Content>

      <Footer className="bottom-nav-dashboard">
        <BottomNav />
      </Footer>
    </Layout>
  );
}

export default Dashboard;
