import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ScrollToSectionLink = ({ to, closeNavbar, ...props }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = () => {
    // If not on the home page, navigate to the home page first
    if (location.pathname !== "/") {
      navigate("/");
    }

    // Close the navbar if it's open
    if (closeNavbar) {
      closeNavbar();
    }

    // After navigating, scroll to the target section
    setTimeout(() => {
      const target = document.querySelector(to);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  }

  return React.createElement("a", { onClick: handleLinkClick, ...props, spy: "true", smooth: "true" });
};

export default ScrollToSectionLink;
