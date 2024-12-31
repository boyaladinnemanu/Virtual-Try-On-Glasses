import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import DefaultContext from "../../context/DefaultContext";
import Cookies from "js-cookie";
import "./index.css";

const Login = () => {
  const { setToken } = useContext(DefaultContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // State for error message

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      const res = await axios.post("http://localhost:3003/login", data);
      const { token, userId } = res.data;
  
      // Store token and userId in cookies
      Cookies.set("token", token);
      Cookies.set("userId", userId);
  
      // Redirect to the home page after successful login
      if (Cookies.get("token")) {
        navigate("/");
      }
    } catch (error) {
      setError("Invalid email or password. Please try again."); 
      console.error("Login failed:", error.message);
    }
  };
  

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={submitHandler}>
        <h3>Login</h3>
        {error && <p className="error-message">{error}</p>} {/* Display error if exists */}
        <input
          type="email"
          onChange={changeHandler}
          name="email"
          placeholder="Email"
          required
        />
        <br />
        <input
          type="password"
          onChange={changeHandler}
          name="password"
          placeholder="Password"
          required
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;
