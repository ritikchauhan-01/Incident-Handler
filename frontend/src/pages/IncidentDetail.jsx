import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { updateIncident } from "../api/incidentApi";

const SEVERITIES = ["SEV1","SEV2","SEV3","SEV4"];
const STATUSES = ["OPEN","MITIGATED","RESOLVED"];

export default function IncidentDetail() {
  const location = useLocation();
  const nav = useNavigate();

  const [form,setForm] = useState(null);
  const [original,setOriginal] = useState(null);
  const [showCreatedMessage,setShowCreatedMessage] = useState(false);

  useEffect(()=>{
    if(location.state){
      const { _justCreated, ...stateData } = location.state;
      const data={...stateData,status:stateData.status||"OPEN"};
      setForm(data);
      setOriginal(JSON.parse(JSON.stringify(data)));
      setShowCreatedMessage(Boolean(_justCreated));
    }else{
      nav("/");
    }
  },[]);

  if(!form) return <Loader/>;

  const update=(field,value)=>{
    setForm(prev=>({...prev,[field]:value}));
  };

  const validateOwner = (value) => {
    const v = (value || "").trim();
    if (!v) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(v) ? "" : "Owner must be a valid email";
  };

  const ownerError = validateOwner(form.owner);
  const isOwnerValid = !ownerError;

  const isDirty = (() => {
    if (!form || !original) return false;

    const current = {
      severity: form.severity || "",
      status: form.status || "",
      owner: form.owner || "",
      summary: form.summary || ""
    };

    const initial = {
      severity: original.severity || "",
      status: original.status || "",
      owner: original.owner || "",
      summary: original.summary || ""
    };

    return JSON.stringify(current) !== JSON.stringify(initial);
  })();

  const save=async()=>{
    if(!isDirty || !isOwnerValid) return;
    try{
      await updateIncident(form.id, {
        severity: form.severity,
        status: form.status,
        owner: (form.owner || "").trim(),
        summary: form.summary
      });
      setOriginal(JSON.parse(JSON.stringify(form)));
      nav(-1);
    }catch(e){
      console.error(e);
      alert("Failed to update incident");
    }
  };

  const cancel=()=>{
    if(!isDirty) return;
    nav(-1);
  };

  const occurredAtText = form.createdAt
    ? new Date(form.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "-";

  const formatLabel = (value) => {
    if (!value) return "-";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  return (
    <div style={{maxWidth:760,margin:"26px auto 40px",padding:"0 6px"}}>
      <div className="form-header" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <button type="button" className="back-btn" onClick={() => nav("/")} style={{ position: "absolute", left: 0 }}>
          {"\u2190 Back"}
        </button>
      </div>

      {showCreatedMessage && (
        <div style={{marginBottom:12,padding:"10px 14px",background:"#e9f8ee",border:"1px solid #b7e3c4",borderRadius:4,color:"#1f6b35",fontWeight:700,fontSize:14}}>
          Ticket created successfully.
        </div>
      )}

      <div style={{border:"1px solid #cfcfd2",background:"#ffffff",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>
        <div style={{padding:"14px 24px",fontSize:38,fontWeight:800,borderBottom:"1px solid #dfe1e4",textAlign:"center"}}>
          {form.title}
        </div>

        <div style={{padding:"0 24px"}}>
          <div style={{display:"flex",gap:10,alignItems:"center",padding:"18px 0",borderBottom:"1px solid #dfe1e4"}}>
            <span style={{fontWeight:700,fontSize:16}}>Service:</span>
            <span style={{fontWeight:600,fontSize:16}}>{formatLabel(form.service)}</span>
          </div>

          <div style={{display:"flex",gap:14,alignItems:"center",padding:"16px 0",borderBottom:"1px solid #dfe1e4"}}>
            <span style={{fontWeight:700,fontSize:16}}>Severity:</span>
            <select
              value={form.severity}
              onChange={e=>update("severity",e.target.value)}
              style={{background:"#e9eaec",border:"1px solid #c9cbd0",borderRadius:5,padding:"6px 10px",fontWeight:600,fontSize:16,minWidth:96}}
            >
              {SEVERITIES.map(s=>(<option key={s}>{s}</option>))}
            </select>
          </div>

          <div style={{display:"flex",gap:14,alignItems:"center",padding:"16px 0",borderBottom:"1px solid #dfe1e4"}}>
            <span style={{fontWeight:700,fontSize:16}}>Status:</span>
            <select
              value={form.status}
              onChange={e=>update("status",e.target.value)}
              style={{background:"#e9eaec",border:"1px solid #c9cbd0",borderRadius:5,padding:"6px 10px",fontWeight:600,fontSize:16,minWidth:132}}
            >
              {STATUSES.map(s=>(
                <option key={s} value={s}>
                  {s[0] + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div style={{display:"flex",gap:14,alignItems:"center",padding:"16px 0",borderBottom:"1px solid #dfe1e4"}}>
            <span style={{fontWeight:700,fontSize:16}}>Assigned To:</span>
            <input
              value={form.owner||""}
              onChange={e=>update("owner",e.target.value)}
              style={{border:"1px solid #c9cbd0",borderRadius:5,padding:"6px 10px",fontSize:16,fontWeight:400,minWidth:110}}
            />
          </div>
          {ownerError && (
            <div style={{color:"#dc2626",fontSize:12,padding:"8px 0 0"}}>
              {ownerError}
            </div>
          )}

          <div style={{display:"flex",gap:14,alignItems:"center",padding:"16px 0",borderBottom:"1px solid #dfe1e4"}}>
            <span style={{fontWeight:700,fontSize:16}}>Occurred At:</span>
            <span style={{fontWeight:400,fontSize:16}}>{occurredAtText}</span>
          </div>

          <div style={{padding:"16px 0",borderBottom:"1px solid #dfe1e4"}}>
            <div style={{fontWeight:700,fontSize:16,marginBottom:10}}>Summary</div>
            <textarea
              rows={3}
              value={form.summary||""}
              onChange={e=>update("summary",e.target.value)}
              style={{width:"100%",boxSizing:"border-box",border:"1px solid #c9cbd0",borderRadius:5,padding:"10px 12px",fontSize:16,fontWeight:500,color:"#646870",resize:"none",background:"#f4f4f5"}}
            />
          </div>

          <div style={{display:"flex",gap:14,padding:"18px 0 24px"}}>
            <button
              disabled={!isDirty || !isOwnerValid}
              style={{background:!isDirty || !isOwnerValid?"#9ca3af":"#50545a",color:"white",padding:"10px 22px",border:"1px solid #43464b",borderRadius:4,fontWeight:700,fontSize:16,minWidth:170,cursor:!isDirty || !isOwnerValid?"not-allowed":"pointer",opacity:!isDirty || !isOwnerValid?0.9:1}}
              onClick={save}
            >
              Save Changes
            </button>
            <button
              disabled={!isDirty}
              style={{padding:"10px 22px",border:"1px solid #bfc2c8",borderRadius:4,background:!isDirty?"#f4f4f5":"#ececef",fontWeight:700,fontSize:16,minWidth:120,cursor:!isDirty?"not-allowed":"pointer",opacity:!isDirty?0.75:1}}
              onClick={cancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
