"use client";

import "./BottomNav.css";
import { useContext } from "react";

import { Menu } from "antd";

// menu
import { items } from "../../context/menuItems";

// context
import { DashboardContext } from "../../context/DashboardContext";

function BottomNav() {
  const { currentMenu, setCurrentMenu } = useContext(DashboardContext);

  const onClick = (key) => {
    setCurrentMenu(key);
  };

  return (
    <div className="bottom-nav-wrapper">
      {items.map((item) => (
        <div onClick={() => onClick(item.key)} key={item.key}>
          {item.label}
        </div>
      ))}
    </div>
  );
}

export default BottomNav;
