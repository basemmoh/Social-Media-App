import type React from "react";
import { Navigate } from "react-router";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (localStorage.getItem("user_tkn")) {
    return children;
  }

  return <Navigate to={"/login"} />;
}

export default ProtectedRoute;
