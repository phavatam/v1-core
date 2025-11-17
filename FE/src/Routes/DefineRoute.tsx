// src/package/admin/adminRoutes.tsx
import { Route } from "react-router-dom";
import { CreateResignation } from "./ListComponentLazy";

/*   */
const DFRoute = [
  <Route path="/admin/resignation-application/new" element={<CreateResignation />} key="new" />,
  <Route path="/admin/resignation-application/:id" element={<CreateResignation />} key="edit" />
];

export default DFRoute;
