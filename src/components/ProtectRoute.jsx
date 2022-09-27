import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom"; // for import react dom navigation components
import { handleUserCount } from "../helpers/apis";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const location = useLocation();
  let navigate = useNavigate();
  var data = "";
  // For only electron use only
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        //   For get all the brand data list
        const response = await handleUserCount();

        data = response.data.data;
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  if (data === 0) {
    localStorage.clear();
    navigate("/login");
  } else {
    if (isAuthenticated === null) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    } else {
      if (isAuthenticated === "true") {
        return children;
      } else {
        return <Navigate to="/" state={{ from: location }} replace />;
      }
    }
  }
}
export default ProtectedRoute;
