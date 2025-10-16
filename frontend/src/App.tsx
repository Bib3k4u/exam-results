import { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import DashboardTable from "./components/DashboardTable";
import "./App.css";

function App() {
  const [page, setPage] = useState<
    "signup" | "login" | "dashboard" | "dashboardTable"
  >("signup");
  const [student, setStudent] = useState<any>(null);

  return (
    <>
      {page === "signup" && (
        <Signup
          onSwitchToLogin={() => setPage("login")}
          onSignup={(user: any) => {
            setStudent(user);
            setPage("dashboardTable");
          }}
        />
      )}
      {page === "login" && (
        <Login
          onLogin={(user: any) => {
            setStudent(user);
            setPage("dashboardTable");
          }}
          onSwitchToSignup={() => setPage("signup")}
        />
      )}
      {page === "dashboard" && (
        <Dashboard
          student={student}
          onLogout={() => {
            setStudent(null);
            setPage("login");
          }}
        />
      )}
      {page === "dashboardTable" && (
        <DashboardTable
          currentStudent={student}
          onLogout={() => {
            setStudent(null);
            setPage("login");
          }}
        />
      )}
    </>
  );
}

export default App;
