import { Mitr } from "next/font/google";
import "./globals.css";

import SmoothScroll from "./components/SmoothScroll";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import { UserAnalysisProvider } from "./context/UserAnalysisContext";

const mitr = Mitr({
  variable: "--font-mitr",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Energize",
  description: "Platform analisis konsumsi energi berbasis AI",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${mitr.variable}`}>
      <body>
        <SmoothScroll />
        <AntdRegistry>
          <UserAnalysisProvider>{children}</UserAnalysisProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
