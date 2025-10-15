import { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [page, setPage] = useState<"signup" | "login" | "dashboard">("signup");
  const [student, setStudent] = useState<any>(null);

  return (
    <>
      {page === "signup" && (
        <Signup
          onSwitchToLogin={() => setPage("login")}
          onSignup={(user: any) => {
            setStudent(user);
            setPage("dashboard");
          }}
        />
      )}
      {page === "login" && (
        <Login
          onLogin={(user: any) => {
            setStudent(user);
            setPage("dashboard");
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
    </>
  );
}

export default App;