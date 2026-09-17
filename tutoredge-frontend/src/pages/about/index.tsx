import { useState } from "react";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";

import AboutTabs from "@/components/about/AboutTabs";
import AboutContent from "@/components/about/AboutContent";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <>
      <NavBar />
      <AboutTabs active={activeTab} onChange={setActiveTab} />
      <AboutContent active={activeTab} />
      <Footer />
    </>
  );
}
