import React, { useState, useEffect } from "react";
import axios from "axios";
import ActiveWorkouts from "../components/ActiveWorkouts";

function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [pendingWorkout, setPendingWorkout] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);

  const [addWorkOutTxt, setAddWorkOutTxt] = useState("Add Workout");
  const [workoutLoadingTxt, setWorkoutLoadingTxt] = useState("Loading..");

  const [savingBtnTxt, setSavingBtnTxt] = useState("Save");


  const [processing, setProcessing] = useState({});

  const token = localStorage.getItem("token");

  // Fetch workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/workouts/getMyWorkouts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const workouts = res.data.workouts || [];
        setWorkoutLoadingTxt("");
        setWorkouts(workouts);

        // separate by status string
        setPendingWorkout(workouts.filter((w) => w.status === "pending"));
        setCompletedWorkouts(workouts.filter((w) => w.status === "completed"));

        console.log("All Workouts:", workouts);
        console.log(
          "Pending:",
          workouts.filter((w) => w.status === "pending")
        );
        console.log(
          "Completed:",
          workouts.filter((w) => w.status === "completed")
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchWorkouts();
  }, [token]);

  // useEffect(() => {
  //   setPendingWorkout(workouts.filter((w) => !w.completed));
  //   setCompletedWorkouts(workouts.filter((w) => w.completed));
  //   console.log("workouts changed");
  // }, [workouts]);

  // Add workout
  const handleAddWorkout = async (e) => {
    setAddWorkOutTxt("Saving...");
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/workouts/addWorkout`,
        { name, duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newWorkout = res.data;

      // Add to all workouts
      setWorkouts((prev) => [...prev, newWorkout]);

      // Since new workouts are "pending" by default
      if (newWorkout.status === "pending") {
        setPendingWorkout((prev) => [...prev, newWorkout]);
      }

      // reset form
      setName("");
      setDuration("");
      setAddWorkOutTxt("Add Workout");
    } catch (err) {
      setAddWorkOutTxt("Add Workout");
      console.error(err);
    }
  };

  // Delete workout
  const handleDelete = async (id) => {
     setProcessing((prev) => ({ ...prev, [id]: "deleting" }));
    try {

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/workouts/deleteWorkout/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove from master list
      setWorkouts((prev) => prev.filter((w) => w._id !== id));

      // Remove from pending list
      setPendingWorkout((prev) => prev.filter((w) => w._id !== id));

      // Remove from completed list
      setCompletedWorkouts((prev) => prev.filter((w) => w._id !== id));
      setTimeout(() => {
        setProcessing((prev) => ({ ...prev, [id]: null }));
      }, 1000);
    } catch (err) {
      setProcessing((prev) => ({ ...prev, [id]: null }));
      console.error(err);
    }
  };

  // Mark as complete
  const handleComplete = async (id) => {
    console.log(id, "handleComplete");
    setProcessing((prev) => ({ ...prev, [id]: "completing" }));
    try {
      const res = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/workouts/completeWorkoutStatus/${id}`,
        { status: "completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedWorkout = res.data.updatedWorkout;
      console.log(updatedWorkout, "updatedWorkout");
      // Update main workouts list
      setWorkouts((prev) =>
        prev.map((w) => (w._id === id ? updatedWorkout : w))
      );

      // Move workout from pending → completed
      setPendingWorkout((prev) => prev.filter((w) => w._id !== id));
      setCompletedWorkouts((prev) => [...prev, updatedWorkout]);
      setTimeout(() => {
        setProcessing((prev) => ({ ...prev, [id]: null }));
      }, 1000);
    } catch (err) {
      console.error(err);
      setProcessing((prev) => ({ ...prev, [id]: null }));
    }
  };

  // Open edit modal
  const startEdit = (id, currentTitle, currentDuration) => {
    setEditId(id);
    setEditTitle(currentTitle);
    setEditDuration(currentDuration || "");
    setShowModal(true);
  };



  // Save update
  const handleUpdate = async (e) => {
    setSavingBtnTxt("Saving...");
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/workouts/updateWorkout/${editId}`,
        {
          name: editTitle.trim(),
          duration: editDuration.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedWorkout = res.data.updatedWorkout;
      console.log(updatedWorkout, 'updatedWorkout');
      // Update main workouts list
      setWorkouts((prev) =>
        prev.map((w) => (w._id === editId ? updatedWorkout : w))
      );

      // Update pending workouts list
      setPendingWorkout((prev) =>
        prev
          .map((w) => (w._id === editId ? updatedWorkout : w))
          .filter((w) => w.status === "pending")
      );

      // Update completed workouts list
      setCompletedWorkouts((prev) =>
        prev
          .map((w) => (w._id === editId ? updatedWorkout : w))
          .filter((w) => w.status === "completed")
      );



      // Reset form state
      setShowModal(false);
      setEditId(null);
      setEditTitle("");
      setEditDuration("");
      setSavingBtnTxt("Save");
    } catch (err) {
      console.error(err);
      setSavingBtnTxt("Save");
    }
  };

  // Split workouts

  return (
    <div>
      <h3>My Workouts</h3>

      {/* Add New Workout */}
      <form onSubmit={handleAddWorkout} className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="New Workout name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <button
        className="btn btn-primary"
        disabled = {addWorkOutTxt === "Saving..."}
        type="submit">
          {addWorkOutTxt}
        </button>
      </form>

      {/* Active Workouts */}
      <h5 className="mt-5">Active Workouts</h5>
      <hr />

      {workoutLoadingTxt === "Loading.." ? (
        <>
          <ul className="list-group mb-4">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              {workoutLoadingTxt}
            </li>
          </ul>
        </>
      ) : (
        <ActiveWorkouts
          handleComplete={handleComplete}
          startEdit={startEdit}
          handleDelete={handleDelete}
          pendingWorkout={pendingWorkout}
          processing={processing}
        />
      )}

      {/* Completed Workouts */}
      <h5>Completed Workouts</h5>
      <hr />
      <ul className="list-group">
        {workoutLoadingTxt === "Loading.." ? (
          <ul className="list-group mb-4">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              {workoutLoadingTxt}
            </li>
          </ul>
        ) : (
          <>
            {completedWorkouts.length === 0 && (
              <li className="list-group-item text-muted">
                No completed workouts
              </li>
            )}

            {completedWorkouts.map((w, i) => (
              <li
                key={i}
                className="list-group-item list-group-item-success d-flex justify-content-between align-items-center"
              >
                <span>
                  {w.name} ({w.duration}) ✅
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(w._id)}
                  disabled={processing[w._id] === "deleting"}
                >
                  {processing[w._id] === "deleting" ? "Deleting..." : "Delete"}
                </button>
              </li>
            ))}
          </>
        )}
      </ul>

      {/* Edit Modal */}
      {showModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleUpdate}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Workout</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Workout name"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Duration"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit"
                  className="btn btn-success"
                  disabled={savingBtnTxt === "Saving..."}
                  >
                    {savingBtnTxt}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutsPage;
