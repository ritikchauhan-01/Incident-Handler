import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import IncidentList from "../pages/IncidentList";
import IncidentDetail from "../pages/IncidentDetail";
import CreateIncident from "../pages/CreateIncident";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <IncidentList /> },
      { path: "create", element: <CreateIncident /> },
      { path: "incidentDetails", element: <IncidentDetail /> }
    ]
  }
]);

export default router;
