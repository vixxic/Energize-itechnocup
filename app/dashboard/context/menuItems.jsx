import { CgProfile } from "react-icons/cg";
import { FiHome } from "react-icons/fi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { LuMedal, LuHistory } from "react-icons/lu";
import { IoChevronBackOutline } from "react-icons/io5";

export const items = [
  {
    key: "dashboard",
    label: (
      <div className="bottom-menu-item">
        <FiHome />
        Dashboard
      </div>
    ),
  },
  {
    key: "analisis",
    label: (
      <div className="bottom-menu-item">
        <TbBrandGoogleAnalytics />
        Analisis
      </div>
    ),
  },
  {
    key: "tantangan",
    label: (
      <div className="bottom-menu-item">
        <LuMedal />
        tantangan
      </div>
    ),
  },
  {
    key: "riwayat",
    label: (
      <div className="bottom-menu-item">
        <LuHistory />
        riwayat
      </div>
    ),
  },
  {
    key: "profil",
    label: (
      <div className="bottom-menu-item">
        <CgProfile />
        profil
      </div>
    ),
  },
  {
    key: "back",
    label: (
      <div
        style={{
          backgroundColor: "#8075E9",
          borderRadius: "5px",
          padding: "5px",
          width: "100%",
        }}
        className="bottom-menu-item"
      >
        <IoChevronBackOutline />
        Back
      </div>
    ),
  },
];
