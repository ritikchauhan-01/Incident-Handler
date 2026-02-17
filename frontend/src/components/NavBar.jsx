import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const hideCreate =
    location.pathname === "/create" ||
    location.pathname === "/incidentDetails";

  return (
    <div className="navbar">
      <h2>Incident Tracker</h2>

      {!hideCreate && (
        <Link className="btn" to="/create">
          Create Incident
        </Link>
      )}
    </div>
  );
}
