import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchIncidents } from "../api/incidentApi";
import { useLocation } from "react-router-dom";



const SERVICES = ["FRONTEND", "BACKEND", "AUTH", "DATABASE", "PAYMENT"];
const SEVERITIES = ["SEV1", "SEV2", "SEV3", "SEV4"];
const STATUSES = ["OPEN", "MITIGATED", "RESOLVED"];

export default function IncidentList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const displayMulti = (arr, placeholder) =>
    arr.length === 0 ? placeholder : arr.length === 1 ? arr[0] : `${arr[0]} +${arr.length - 1}`;

  /* ---------------- STATE ---------------- */

  const [page, setPage] = useState(Number(searchParams.get("page")) || 0);

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  

  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedServices, setSelectedServices] = useState(
    searchParams.get("service")?.split(",") || []
  );
  const [selectedSeverity, setSelectedSeverity] = useState(
    searchParams.get("severity")?.split(",") || []
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status")?.split(",") || []
  );

  /* FILTER DROPDOWNS */
  const [serviceOpen, setServiceOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const serviceRef = useRef(null);
  const statusRef = useRef(null);

  /* COLUMN DROPDOWNS */
  const [serviceColumnOpen, setServiceColumnOpen] = useState(false);
  const [statusColumnOpen, setStatusColumnOpen] = useState(false);
  const serviceColumnRef = useRef(null);
  const statusColumnRef = useRef(null);

  const firstLoad = useRef(true);

  /* ---------------- OUTSIDE CLICK ---------------- */

  useEffect(() => {
    const handler = (e) => {
      if (serviceRef.current && !serviceRef.current.contains(e.target)) setServiceOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false);
      if (serviceColumnRef.current && !serviceColumnRef.current.contains(e.target)) setServiceColumnOpen(false);
      if (statusColumnRef.current && !statusColumnRef.current.contains(e.target)) setStatusColumnOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- REACTIVE SEARCH ---------------- */

  useEffect(() => {
    setPage(0);
    setSearch(searchInput);
  }, [searchInput]);

  /* ---------------- SINGLE API EFFECT ---------------- */

  const [applyKey,setApplyKey]=useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchIncidents({
          page,
          size: 10,
          sortBy: sortField,
          sortDirection: sortDir,
          search: search || undefined,
          service: selectedServices.join(",") || undefined,
          severity: selectedSeverity.join(",") || undefined,
          status: selectedStatus.join(",") || undefined
        });

        setData(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    fetchData();
  }, [page, search, sortField, sortDir, applyKey]);

  /* ---------------- URL SYNC ---------------- */

  useEffect(() => {
     if (location.pathname !== "/") return;
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    if (selectedServices.length) params.service = selectedServices.join(",");
    if (selectedSeverity.length) params.severity = selectedSeverity.join(",");
    if (selectedStatus.length) params.status = selectedStatus.join(",");
    setSearchParams(params);
  }, [page, search, selectedServices, selectedSeverity, selectedStatus]);

  /* ---------------- HANDLERS ---------------- */

  const toggleMulti = (value, list, setter) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const changeCreatedSort = () => {
    setSortField("createdAt");
    setSortDir(prev => prev === "asc" ? "desc" : "asc");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="container">

      {/* FILTER PANEL */}
      <div className="filter-panel">

        <div className="filter-grid">

          {/* SERVICE */}
          <div className="field-group" ref={serviceRef}>
            <label className="label">Service:</label>
            <div className="dropdown">
              <div className="dropdown-header" onClick={() => setServiceOpen(!serviceOpen)}>
                {displayMulti(selectedServices, "Select Service")}
              </div>
              {serviceOpen && (
                <div className="dropdown-menu">
                  {SERVICES.map(s => (
                    <label key={s}>
                      <input type="checkbox"
                        checked={selectedServices.includes(s)}
                        onChange={() => toggleMulti(s, selectedServices, setSelectedServices)} />
                      {s}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEVERITY */}
          <div className="field-group">
            <label className="label">Severity:</label>
            <div className="checkbox-group">
              {SEVERITIES.map(s => (
                <label key={s}>
                  <input type="checkbox"
                    checked={selectedSeverity.includes(s)}
                    onChange={() => toggleMulti(s, selectedSeverity, setSelectedSeverity)} />
                  {s}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-grid">

          {/* STATUS */}
          <div className="field-group" ref={statusRef}>
            <label className="label">Status:</label>
            <div className="dropdown">
              <div className="dropdown-header" onClick={() => setStatusOpen(!statusOpen)}>
                {displayMulti(selectedStatus, "Select Status")}
              </div>
              {statusOpen && (
                <div className="dropdown-menu">
                  {STATUSES.map(s => (
                    <label key={s}>
                      <input type="checkbox"
                        checked={selectedStatus.includes(s)}
                        onChange={() => toggleMulti(s, selectedStatus, setSelectedStatus)} />
                      {s}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEARCH */}
          <div className="search-area" style={{flex:1,minWidth:200,display:"flex",alignItems:"center"}}>
  <input
    style={{flex:1,padding:"8px 12px",boxSizing:"border-box"}}
    placeholder="Search incidents..."
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
  />

  <button
    style={{
      padding:"8px 16px",
      marginLeft:16,
      whiteSpace:"nowrap",
      backgroundColor:"#d32f2f",
      color:"white",
      border:"none",
      borderRadius:4,
      cursor:"pointer"
    }}
    onClick={()=>{setPage(0);setApplyKey(k=>k+1);}}
  >
    Filter
  </button>
</div>

        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>

              <th className="column-dropdown" ref={serviceColumnRef}>
                <span onClick={() => setServiceColumnOpen(!serviceColumnOpen)}>Service ▼</span>
                {serviceColumnOpen && (
                  <div className="column-menu">
                    <div onClick={() => setSelectedServices([])}>All</div>
                    {SERVICES.map(s => (
                      <div key={s} onClick={() => { setSelectedServices([s]); setSortField("service"); }}>
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </th>

              <th className="column-dropdown" ref={statusColumnRef}>
                <span onClick={() => setStatusColumnOpen(!statusColumnOpen)}>Status ▼</span>
                {statusColumnOpen && (
                  <div className="column-menu">
                    <div onClick={() => setSelectedStatus([])}>All</div>
                    {STATUSES.map(s => (
                      <div key={s} onClick={() => { setSelectedStatus([s]); setSortField("status"); }}>
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </th>

              <th className="sortable" onClick={changeCreatedSort}>
                CreatedAt {sortDir === "asc" ? "▲" : "▼"}
              </th>

              <th>Owner</th>
            </tr>
          </thead>

          <tbody>
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan="5">
                  <div style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",fontWeight:500}} className="no-data">
                    No incidents found
                  </div>
                </td>
              </tr>
            )}

            {data.map(i => (
              <tr key={i.id} className="clickable-row"
                onClick={() => navigate("/incidentDetails", { state: i })}>
                <td>{i.title}</td>
                <td>{i.service}</td>
                <td><span className={`status-badge ${i.status.toLowerCase()}`}>{i.status}</span></td>
                <td>{new Date(i.createdAt).toLocaleString()}</td>
                <td>{i.owner || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="table-overlay">
            <div className="loader-circle"></div>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page===0} onClick={()=>setPage(page-1)}>Prev</button>
          {[...Array(totalPages).keys()].map(p=>(
            <button key={p} className={p===page?"active":""} onClick={()=>setPage(p)}>{p+1}</button>
          ))}
          <button disabled={page===totalPages-1} onClick={()=>setPage(page+1)}>Next</button>
        </div>
      )}

    </div>
  );
}
