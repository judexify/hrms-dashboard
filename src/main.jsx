import { AuthProvider } from "./context/AuthContext.jsx";
import EmployeeProvider from "./context/HRContext.jsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <EmployeeProvider>
      <App />
    </EmployeeProvider>
  </AuthProvider>,
);
