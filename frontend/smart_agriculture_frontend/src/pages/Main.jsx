// src/pages/Main.jsx
import React from "react";
import Home from "./Home";
import SideBar from "../components/atomic_design/organism/SideBar";
import Footer from "../components/atomic_design/organism/Footer";
import Layout from "../components/atomic_design/template/Layout";

const Main = () => {
  return (
    <Layout>
      <Home />
    </Layout>
  );
};

export default Main;
