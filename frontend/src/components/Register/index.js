import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "./index.css";

const Register = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState(""); // For displaying validation errors

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Client-side validation for password and confirmpassword
    if (data.password !== data.confirmpassword) {
      setError("Passwords do not match.");
      return;
    }

    axios
      .post("http://localhost:3003/registration-form", data)
      .then(() => {
        navigate("/login"); // Redirect to login page after successful registration
      })
      .catch((err) => {
        setError("Registration failed. Please try again.");
        console.error(err);
      });
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={submitHandler}>
        <h3>Register</h3>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          onChange={changeHandler}
          name="username"
          placeholder="User Name"
          required
        />
        <input
          type="email"
          onChange={changeHandler}
          name="email"
          placeholder="Email"
          required
        />
        <input
          type="password"
          onChange={changeHandler}
          name="password"
          placeholder="Password"
          required
        />
        <input
          type="password"
          onChange={changeHandler}
          name="confirmpassword"
          placeholder="Confirm Password"
          required
        />
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default Register;
