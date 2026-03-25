import Login from "./pages/Login/Login";
import Home from "./pages/Home";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import Attendance from "./routes/Attendance";
import Candidates from "./routes/Candidates";
import DashBoard from "./routes/DashBoard";
import Employees from "./routes/Employees";
import Holidays from "./routes/Holidays";
import Jobs from "./routes/Jobs";
import Leaves from "./routes/Leaves";
import Payroll from "./routes/Payroll";
import Settings from "./routes/Settings";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Home />} path="/">
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/leaves" element={<Leaves />} />
              <Route path="/holidays" element={<Holidays />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route element={<Login />} path="/login" />
        </Routes>
      </Router>
    </div>
  );
}
