import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoutes from "./components/PrivateWrappers";
import AppLayout from "./layouts/AppLayout";
import "ldrs/react/DotSpinner.css";
import "leaflet/dist/leaflet.css";
import Users from "./pages/Users";
import AddUser from "./pages/Users/AddUser";
import EditUser from "./pages/Users/EditUser";
import Plans from "./pages/Plans";
import Cars from "./pages/Cars";
import EditPlan from "./pages/Plans/EditPlan";
import CreatePlan from "./pages/Plans/CreatePlan";
import CreateCar from "./pages/Cars/CreateCar";
import EditCar from "./pages/Cars/EditCar";
import Companies from "./pages/Companies";
import CreateCompany from "./pages/Companies/AddCompany";
import EditCompany from "./pages/Companies/EditCompany";
import Filters from "./pages/Companies/HealthFilters";
import LifeFilters from "./pages/Companies/LifeFilters";
import CarFilters from "./pages/Companies/CarFilters";
import CarFiltersGroups from "./pages/Companies/CarFiltersGroups";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route Component={PrivateRoutes}>
          <Route
            path="/home"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />
          <Route
            path="/users"
            element={
              <AppLayout>
                <Users />
              </AppLayout>
            }
          />
          <Route
            path="/plans"
            element={
              <AppLayout>
                <Plans />
              </AppLayout>
            }
          />
          <Route
            path="/plans/add"
            element={
              <AppLayout>
                <CreatePlan />
              </AppLayout>
            }
          />
          <Route
            path="/plans/edit/:id"
            element={
              <AppLayout>
                <EditPlan />
              </AppLayout>
            }
          />
          <Route
            path="/users/add"
            element={
              <AppLayout>
                <AddUser />
              </AppLayout>
            }
          />
          <Route
            path="/users/edit/:id"
            element={
              <AppLayout>
                <EditUser />
              </AppLayout>
            }
          />
          <Route
            path="/cars"
            element={
              <AppLayout>
                <Cars />
              </AppLayout>
            }
          />
          <Route
            path="/cars/add"
            element={
              <AppLayout>
                <CreateCar />
              </AppLayout>
            }
          />
          <Route
            path="/cars/edit/:id"
            element={
              <AppLayout>
                <EditCar />
              </AppLayout>
            }
          />
          <Route
            path="/companies"
            element={
              <AppLayout>
                <Companies />
              </AppLayout>
            }
          />
          <Route
            path="/companies/add"
            element={
              <AppLayout>
                <CreateCompany />
              </AppLayout>
            }
          />
          <Route
            path="/companies/HEALTH/filters/:id"
            element={
              <AppLayout>
                <Filters />
              </AppLayout>
            }
          />
          <Route
            path="/companies/LIFE/filters/:id"
            element={
              <AppLayout>
                <LifeFilters />
              </AppLayout>
            }
          />
          <Route
            path="/companies/CAR/filters/GROUP/:id"
            element={
              <AppLayout>
                <CarFiltersGroups />
              </AppLayout>
            }
          />
          <Route
            path="/companies/CAR/filters/RANGE/:id"
            element={
              <AppLayout>
                <CarFilters />
              </AppLayout>
            }
          />
          <Route
            path="/companies/edit/:id"
            element={
              <AppLayout>
                <CarFilters />
              </AppLayout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
