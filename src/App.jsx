import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import Profile from "./pages/Profile";

function App() {
  const { token } = useContext(AuthContext);
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h2>Welcome to Fitness App 💪</h2>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
          path="/workouts"
          element={token ? <WorkoutsPage /> : <Navigate to="/login" />}
        />
          <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
        </Routes>
      </div>
    </>
  );
}

export default App;
