import React from "react";
import { Link as ScrollLink } from "react-scroll";
import { useNavigate, useLocation } from "react-router-dom";

const ScrollToSectionLink = ({ to, ...props }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = () => {
    // If not on the home page, navigate to the home page first
    if (location.pathname !== "/") {
      navigate("/");
    }

    // After navigating, scroll to the target section
    setTimeout(() => {
      ScrollLink.scrollTo(to, {
        smooth: true,
        offset: -100,
        duration: 500,
      });
    }, 100);
  };

  return React.createElement(ScrollLink, { to, onClick: handleLinkClick, ...props });
};
export default ScrollToSectionLink;
