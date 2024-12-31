import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdCart } from "react-icons/io";
import Cookies from "js-cookie";
import "./index.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove('userId');
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1 className="navbar-title">Spectry</h1>
      </div>
      <div className="navbar-icons">
        {token ? (
          <>
            <button
              type="button"
              className="nav-icon-button"
              onClick={() => navigate("/cart")}
            >
              <IoMdCart className="nav-icon"/>
            </button>
            <button
              type="button"
              className="nav-icon-button"
              onClick={() => navigate("/orders")}
            >
              Orders
            </button>
            <button
              type="button"
              className="nav-icon-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="nav-icon-button"
              onClick={() => navigate("/registration-form")}
            >
              Register
            </button>
            <button
              type="button"
              className="nav-icon-button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
