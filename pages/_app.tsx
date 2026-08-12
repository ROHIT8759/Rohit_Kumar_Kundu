import type { AppProps } from "next/app";
import { Geist } from "next/font/google";
import AnalyticsTracker from "../src/components/AnalyticsTracker";
import WebMcpTools from "../src/components/WebMcpTools";

import "../src/index.css";
import "../src/App.css";
import "../src/components/styles/About.css";
import "../src/components/styles/Career.css";
import "../src/components/styles/Contact.css";
import "../src/components/styles/Cursor.css";
import "../src/components/styles/Landing.css";
import "../src/components/styles/Loading.css";
import "../src/components/styles/Navbar.css";
import "../src/components/styles/SocialIcons.css";
import "../src/components/styles/style.css";
import "../src/components/styles/WhatIDo.css";
import "../src/components/styles/Work.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-geist",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={geist.variable}>
      <AnalyticsTracker />
      <WebMcpTools />
      <Component {...pageProps} />
    </div>
  );
}
