import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIncident } from "../api/incidentApi";

export default function CreateIncident() {

  const nav = useNavigate();

  // ---------- INITIAL STATE ----------
  const initialState = {
    title: "",
    service: "",
    severity: "SEV4",   // default severity
    status: "OPEN",
    owner: "",
    summary: ""
  };

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  // ---------- VALIDATION ----------
  const validateTitle = (value) => {
    if (!value) return "Title is required";
    if (value.length < 10) return "Title must be at least 10 characters";
    return "";
  };

  const validateOwner = (value) => {
    const v = (value || "").trim();
    if (!v) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(v) ? "" : "Owner must be a valid email";
  };

  const titleError = validateTitle(form.title);
  const ownerError = validateOwner(form.owner);
  const isTitleValid = !titleError;
  const isOwnerValid = !ownerError;

  const isFormValid =
    isTitleValid &&
    isOwnerValid &&
    form.service &&
    form.severity &&
    form.status;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  

  // ---------- SUBMIT ----------
  const submit = async (e) => {
  e.preventDefault();

  const newErrors = {};
  if (!isTitleValid) newErrors.title = titleError;
  if (!isOwnerValid) newErrors.owner = ownerError;
  if (!form.service) newErrors.service = "Service required";
  if (!form.severity) newErrors.severity = "Severity required";
  if (!form.status) newErrors.status = "Status required";

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  try {
    const res = await createIncident({ ...form, owner: (form.owner || "").trim() });   // <-- API CALL
    nav("/incidentDetails", { state: { ...res.data, _justCreated: true } }); // navigate with DB response
  } catch (err) {
    console.error("Create failed", err);
    alert("Failed to create incident");
  }
};


  // ---------- CANCEL ----------
  const cancel = () => {
    setForm(initialState); // resets severity back to SEV4
    setErrors({});
  };

  // ---------- BACK ----------
  const goBack = () => nav("/");

  return (
    <div className="form-wrapper">
      <form className="form" onSubmit={submit}>

        {/* HEADER */}
        <div className="form-header" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button type="button" className="back-btn" onClick={goBack} style={{ position: "absolute", left: 0 }}>
            ← Back
          </button>
          <h2 style={{ textAlign: "center", width: "100%", margin: 0 }}>Create New Incident</h2>
        </div>

        {/* TITLE */}
        <label>Title</label>
        <input
          value={form.title}
          placeholder="Short incident title (e.g., Payments failing for EU users)"
          onChange={e => handleChange("title", e.target.value)}
        />
        {titleError && <span className="error">{titleError}</span>}

        {/* SERVICE */}
        <label>Service</label>
        <select
          disabled={!isTitleValid}
          value={form.service}
          onChange={e => handleChange("service", e.target.value)}
        >
          <option value="">Select affected service</option>
          <option value="FRONTEND">Frontend</option>
          <option value="BACKEND">Backend</option>
          <option value="AUTH">Auth</option>
          <option value="DATABASE">Database</option>
          <option value="PAYMENT">Payments</option>
        </select>
        {errors.service && <span className="error">{errors.service}</span>}

        {/* SEVERITY */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
          <label style={{ margin: 0, minWidth: 70 }}>Severity</label>
          <div className="radio-group" style={{ margin: 0 }}>
            {["SEV1", "SEV2", "SEV3", "SEV4"].map(sev => (
              <label key={sev} className="radio-item">
                <input
                  type="radio"
                  name="severity"
                  value={sev}
                  disabled={!isTitleValid}
                  checked={form.severity === sev}
                  onChange={() => handleChange("severity", sev)}
                />
                {sev}
              </label>
            ))}
          </div>
        </div>
        {errors.severity && <span className="error">{errors.severity}</span>}

        {/* STATUS */}
        <label>Status</label>
        <select
          disabled={!isTitleValid}
          value={form.status}
          onChange={e => handleChange("status", e.target.value)}
        >
          <option value="">Select status</option>
          <option value="OPEN">OPEN</option>
          <option value="MITIGATED">MITIGATED</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
        {errors.status && <span className="error">{errors.status}</span>}

        {/* OWNER */}
        <label>Owner</label>
        <input
          value={form.owner}
          placeholder="Responsible engineer (optional)"
          onChange={e => handleChange("owner", e.target.value)}
        />
        {errors.owner && <span className="error">{errors.owner}</span>}

        {/* SUMMARY */}
        <label>Summary</label>
        <textarea
          rows={3}
          value={form.summary}
          placeholder="Describe the issue, impact, and known details..."
          onChange={e => handleChange("summary", e.target.value)}
        />

        {/* ACTIONS */}
        <div className="form-actions">
          <button type="button" className="btn cancel" onClick={cancel}>
            Cancel
          </button>

          <button
            type="submit"
            className={`btn create ${!isFormValid ? "disabled" : ""}`}
            disabled={!isFormValid}
          >
            Create Incident
          </button>
        </div>

      </form>
    </div>
  );
}
