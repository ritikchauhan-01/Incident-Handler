import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api"
});

export const fetchIncidents = (params) =>
  api.get("/incidents", { params });

export const getIncident = (id) =>
  api.get(`/incidents/${id}`);

export const createIncident = (data) =>
  api.post("/incidents", data);

export const updateIncident = (id, data) =>
  api.patch(`http://localhost:8080/api/incidents/${id}`, data);
