import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://fitnessapp-api-ln8u.onrender.com";

function WorkoutForm({ onSuccess }) {
  const [form, setForm] = useState({ title: "", description: "" });
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/addWorkout`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: "", description: "" });
      onSuccess();
    } catch (err) {
      console.error("Failed to add workout", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <input
          type="text"
          name="title"
          className="form-control"
          placeholder="Workout Title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <textarea
          name="description"
          className="form-control"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <button className="btn btn-primary">Add Workout</button>
    </form>
  );
}

export default WorkoutForm;
