import React, { useState } from "react";
import axios from "axios";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/register`, {
        email,
        password,
      });
      setMessage("Registration successful ✅");
    } catch (err) {
      setMessage("Registration failed ❌");
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Register</h3>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email}
                 onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password}
                 onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-success">Register</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}

    </div>
  );
}

export default RegisterPage;
