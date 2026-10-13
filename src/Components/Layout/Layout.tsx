import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "./../Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

function Layout() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-200 min-h-screen flex justify-center items-center flex-col pt-32">
        <Outlet />
        <Toaster />
      </div>
      <ScrollRestoration />
      <ScrollToTop />
    </>
  );
}

export default Layout;