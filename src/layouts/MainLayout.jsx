import Footer from "../components/Footer";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => (
  <div>
    {/* ...header, nav, etc... */}
    <Outlet />
    <Footer />
  </div>
);

export default MainLayout;