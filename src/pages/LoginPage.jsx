import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const { setToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [loginText, setLoginText] = useState("Login")

  const handleLogin = async (e) => {
    setLoginText('Loging in..')
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        { email, password }
      );

      setMessage("Login successful ✅");
      localStorage.setItem("token", res.data.access);

      setToken(res.data.access);   // ✅ update context + localStorage
      navigate("/workouts");       // ✅ redirect

      // redirect after successful login
      setTimeout(() => {
        navigate("/workouts");
      }, 1000);


    } catch (err) {
      setMessage("Login failed ❌");
      setLoginText('Login')
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit"
        className="btn btn-primary"
        disabled={ loginText === "Loging in.."}
        >
          {loginText}
        </button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}

      <div className="mt-5">
        <p>s58@mail.com - password123</p>
        <p>local@gmail.com 123456789</p>
      </div>
    </div>
  );
}

export default LoginPage;
