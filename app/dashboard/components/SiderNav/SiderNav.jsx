"use client";

import "./SiderNav.css";
import { useContext } from "react";
import { useRouter } from "next/navigation";

import { Menu } from "antd";

// data
import { items } from "../../context/menuItems";

// context
import { DashboardContext } from "../../context/DashboardContext";

function SiderNav() {
  const { currentMenu, setCurrentMenu } = useContext(DashboardContext);
  const router = useRouter();

  const onClick = (e) => {
    if (e.key === "back") {
      router.push("/");
      return;
    }

    setCurrentMenu(e.key);
  };

  return (
    <div className="sider-link-dashboard">
      <div className="logo-sider-dashboard">
        <img src="/logo.png" />
        <p>Energize</p>
      </div>

      <Menu
        onClick={onClick}
        selectedKeys={[currentMenu]}
        mode="inline"
        items={items}
      />
    </div>
  );
}

export default SiderNav;
