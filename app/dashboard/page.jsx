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

function Dashboard() {
  const { currentMenu } = useContext(DashboardContext);

  return (
    <Layout>
      <Sider className="sider-dashboard-con" width={280}>
        <SiderNav />
      </Sider>

      <Content className="content-dashboard">
        {currentMenu === "dashboard" ? (
          <DashboardContent />
        ) : currentMenu === "analisis" ? (
          <div>
            <FormContent />
          </div>
        ) : currentMenu === "tantangan" ? (
          <div>
            <ChallengeContent />
          </div>
        ) : currentMenu === "riwayat" ? (
          <div>
            <p>halaman riwayat</p>
          </div>
        ) : currentMenu === "profil" ? (
          <div>
            <ProfileContent />
          </div>
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
