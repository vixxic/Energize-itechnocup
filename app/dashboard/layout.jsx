import { DashboardProvider } from "./context/DashboardContext";
import { App } from "antd";

export default function DashboardLayout({ children }) {
  return (
    <App>
      <DashboardProvider>{children}</DashboardProvider>
    </App>
  );
}
