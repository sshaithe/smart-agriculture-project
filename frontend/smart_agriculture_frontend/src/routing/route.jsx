// src/components/atomic_design/routing/route.js
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/atomic_design/template/Layout";

// Sayfa bileşenleri (hepsi ../pages klasöründen)
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Service from "../pages/Service";
import Background from "../pages/Background";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import NotFound from "../components/atomic_design/organism/NotFound";
import CityDetail from "../pages/CityDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Tüm sayfalar Layout'un içinde
    children: [
      {
        path: "/",         // veya index: true da kullanabilirsin
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/service",
        element: <Service />,
      },
      {
        path: "/regions/:regionId",
        element: <CityDetail />
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/background",
        element: <Background />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
