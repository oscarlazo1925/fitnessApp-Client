export default function ActiveWorkouts({
  handleComplete,
  startEdit,
  handleDelete,
  pendingWorkout,
  processing,
}) {
  return (
    <>
      <ul className="list-group mb-4">
        {pendingWorkout.length === 0 && (
          <li className="list-group-item text-muted">No active workouts</li>
        )}

        {pendingWorkout.map((w, i) => (
          <li
            key={w._id || i}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              {w.name} {w.duration ? `(${w.duration})` : ""}
            </span>
            <div>
              <button
                className="btn btn-success btn-sm me-2"
                disabled={processing[w._id] === "completing"}
                onClick={() => handleComplete(w._id)}
              >
               {processing[w._id] === "completing" ? "Processing..." : "Complete"}
              </button>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => startEdit(w._id, w.name, w.duration)}
                disabled={processing[w._id]}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                disabled={processing[w._id] === "deleting"}
                onClick={() => handleDelete(w._id)}
              >
                {processing[w._id] === "deleting" ? "Deleting..." : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
