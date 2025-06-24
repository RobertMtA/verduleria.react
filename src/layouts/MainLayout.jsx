import Footer from "../components/Footer";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      {/* <Navbar />  <-- Elimina o comenta esta línea si existe */}
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;