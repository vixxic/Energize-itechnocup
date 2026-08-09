"use client";

import "./SiderNav.css";
import { useContext } from "react";

import { Menu } from "antd";

// data
import { items } from "../../context/menuItems";

// context
import { DashboardContext } from "../../context/DashboardContext";

function SiderNav() {
  const { currentMenu, setCurrentMenu } = useContext(DashboardContext);

  const onClick = (e) => {
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
