import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HomeNavbar from "../components/Navbars/HomeNavbar";
import NonstickyFooter from "../components/Footers/NonstickyFooter";

const Home = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => ({ ...state }));

  const roleBasedRedirect = (user) => {
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/my/dashboard");
    }
  };

  useEffect(() => {
    if (user && user.token) roleBasedRedirect(user);
  });

  return (
    <div>
      <HomeNavbar />
      <NonstickyFooter sx={{ mt: 8, mb: 4 }} />
    </div>
  );
};

export default Home;
