import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";

import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Home from "./components/pages/Home";
import Dashboard from "./components/pages/Dashboard";
import CreateCompany from "./components/creationComponents/CreateCompany";
import PropertiesList from "./components/propertyComponents/PropertiesList";
import CreateProperty from "./components/propertyComponents/CreateProperty";
import PropertyDetail from "./components/propertyComponents/PropertyDetail";
import UnitsManager from "./components/propertyComponents/UnitsManager";
import AddTransactionForm from "./components/financialComponents/AddTransactionForm";
import MaintenanceRequests from "./components/maintenanceComponents/MaintenanceRequests";
import LeasesManager from "./components/leaseComponents/LeasesManager";
import withAuth from "./components/withAuth";
import Navbar from "./components/pages/Navbar";
import "./components/styles/Navbar.css";
import { AuthProvider } from "./contexts/AuthContext";
import TenantsManager from "./components/propertyComponents/TenantsManager";
import CreateLease from "./components/leaseComponents/CreateLease";
import EditProperty from "./components/propertyComponents/EditProperty";
import LeasesListByCompany from "./components/leaseComponents/LeasesListByCompany";
import RolesManager from "./components/RolesManager";
import CreateUserForm from "./components/creationComponents/CreateUserForm";
import Unauthorized from "./components/Unauthorized";
import BudgetForecast from "./components/Budgets/BudgetForecast";
import "./components/styles/Pagination.css";
import ProfilePage from "./components/pages/ProfilePage";
import Tutorial from "./components/pages/Tutorial";

const ProtectedDashboard = withAuth(Dashboard, 1);
const ProtectedCreateCompany = withAuth(CreateCompany);
const ProtectedPropertiesList = withAuth(PropertiesList);
const ProtectedCreateProperty = withAuth(CreateProperty);
const ProtectedPropertyDetail = withAuth(PropertyDetail);
const ProtectedUnitsManager = withAuth(UnitsManager);
const ProtectedAddTransactionForm = withAuth(AddTransactionForm);
const ProtectedMaintenanceRequests = withAuth(MaintenanceRequests);
const ProtectedTenantsManager = withAuth(TenantsManager);
const ProtectedLeasesManager = withAuth(LeasesManager);
const ProtectedEditProperty = withAuth(EditProperty);
const ProtectedLeasesListByTenant = withAuth(LeasesListByCompany);
const ProtectedRolesManager = withAuth(RolesManager);
const ProtectedCreateUserForm = withAuth(CreateUserForm);
const ProtectedBudgetForecast = withAuth(BudgetForecast);
const ProtectedProfilePage = withAuth(ProfilePage);

function AppLayout() {
  const location = useLocation(); // useLocation inside the Router context
  const hideNavbarOnRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarOnRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/profile/:id" element={<ProtectedProfilePage />} />{" "}
        <Route path="/create-company" element={<ProtectedCreateCompany />} />
        <Route path="/budget-forecast" element={<ProtectedBudgetForecast />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/properties" element={<ProtectedPropertiesList />} />
        <Route path="/tenants" element={<ProtectedTenantsManager />} />
        <Route path="/edit-property/:id" element={<ProtectedEditProperty />} />
        <Route path="/create-property" element={<ProtectedCreateProperty />} />
        <Route path="/property/:id" element={<ProtectedPropertyDetail />}>
          <Route path="units" element={<ProtectedUnitsManager />} />
          <Route
            path="transactions"
            element={<ProtectedAddTransactionForm />}
          />
        </Route>
        <Route
          path="/properties/:propertyId/units/:unitId/requests"
          element={<ProtectedMaintenanceRequests />}
        />
        <Route path="/leases" element={<ProtectedLeasesManager />} />
        <Route path="/create-lease" element={<CreateLease />} />
        <Route
          path="/leases-by-tenant/:tenantId"
          element={<ProtectedLeasesListByTenant />}
        />
        <Route path="/dashboard/roles" element={<ProtectedRolesManager />} />
        <Route path="/create-user" element={<ProtectedCreateUserForm />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
