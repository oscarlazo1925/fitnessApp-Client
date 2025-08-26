import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // adjust path

export default function Profile() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login"); // redirect if not logged in
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/details`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res.data)
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, navigate]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>User Profile</h2>
      {user ? (
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Name:</strong> {user.name}
          </li>
          <li className="list-group-item">
            <strong>Email:</strong> {user.email}
          </li>
          <li className="list-group-item">
            <strong>Role:</strong> {user.role || "User"}
          </li>
          <li className="list-group-item">
            <strong>Created At:</strong>{" "}
            {new Date(user.createdAt).toLocaleString()}
          </li>
        </ul>
      ) : (
        <p>No user details found.</p>
      )}
    </div>
  );
}
