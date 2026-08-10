"use client";

import "./dashboard.css";
import { useContext } from "react";
import { DashboardContext } from "./context/DashboardContext";

// components
import BottomNav from "./components/BottomNav/BottomNav";
import SiderNav from "./components/SiderNav/SiderNav";
import FormContent from "./dashboardSection/FormContent/FormContent";
import DashboardContent from "./dashboardSection/DashboardContent/DashboardContent";
import ChallengeContent from "./dashboardSection/ChallengeContent/ChallengeContent";
import ProfileContent from "./dashboardSection/Profile/ProfileContent";

import { Layout } from "antd";

const { Sider, Content, Footer } = Layout;

function BlokirAnalisis({ setCurrentMenu }) {
  return (
    <div className="blokir-analisis">
      <h3>Anda belum melakukan analisis</h3>
      <button type="button" onClick={() => setCurrentMenu("analisis")}>Lakukan Analisis</button>
    </div>
  );
}

function Dashboard() {
  const { currentMenu, setCurrentMenu, analysis } = useContext(DashboardContext);
  const terkunci = !analysis && currentMenu !== "analisis" && currentMenu !== "dashboard";

  return (
    <Layout>
      <Sider className="sider-dashboard-con" width={280}>
        <SiderNav />
      </Sider>

      <Content className="content-dashboard">
        {currentMenu === "analisis" ? (
          <FormContent />
        ) : currentMenu === "dashboard" ? (
          <DashboardContent />
        ) : terkunci ? (
          <BlokirAnalisis setCurrentMenu={setCurrentMenu} />
        ) : currentMenu === "tantangan" ? (
          <ChallengeContent />
        ) : currentMenu === "riwayat" ? (
          <div>
            <p>halaman riwayat</p>
          </div>
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
