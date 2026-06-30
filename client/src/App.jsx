import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Contacts from "./pages/Contacts.jsx";
import Inbox from "./pages/Inbox.jsx";

export default function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2 className="logo">WA CRM</h2>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/inbox">Inbox</NavLink>
          <NavLink to="/contacts">Contacts</NavLink>
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/contacts" element={<Contacts />} />
        </Routes>
      </main>
    </div>
  );
}
