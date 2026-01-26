import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoutes from "./components/PrivateWrappers";
import AppLayout from "./layouts/AppLayout";
import "ldrs/react/DotSpinner.css";
import "leaflet/dist/leaflet.css";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
