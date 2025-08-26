import React from "react";
import axios from "axios";

const API_BASE = "https://fitnessapp-api-ln8u.onrender.com";

function WorkoutList({ workouts, refresh }) {
  const token = localStorage.getItem("token");

  const deleteWorkout = async (id) => {
    await axios.delete(`${API_BASE}/deleteWorkout/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    refresh();
  };

  const toggleComplete = async (id) => {
    await axios.patch(`${API_BASE}/completeWorkoutStatus/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    refresh();
  };

  return (
    <ul className="list-group">
      {workouts.map((w) => (
        <li
          key={w._id}
          className={`list-group-item d-flex justify-content-between align-items-center ${
            w.completed ? "list-group-item-success" : ""
          }`}
        >
          <div>
            <strong>{w.title}</strong> <br />
            <small>{w.description}</small>
          </div>
          <div>
            <button
              className="btn btn-sm btn-outline-success me-2"
              onClick={() => toggleComplete(w._id)}
            >
              {w.completed ? "Undo" : "Complete"}
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => deleteWorkout(w._id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default WorkoutList;
