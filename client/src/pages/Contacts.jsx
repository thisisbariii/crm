import { useEffect, useState } from "react";
import api from "../api.js";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ phone: "", name: "", tags: "" });
  const [search, setSearch] = useState("");

  const load = () => api.get("/contacts").then((res) => setContacts(res.data));

  useEffect(() => { load(); }, []);

  const addContact = async (e) => {
    e.preventDefault();
    if (!form.phone || !form.name) return;
    await api.post("/contacts", {
      phone: form.phone,
      name: form.name,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
    });
    setForm({ phone: "", name: "", tags: "" });
    load();
  };

  const deleteContact = async (id) => {
    await api.delete(`/contacts/${id}`);
    load();
  };

  const filtered = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <div>
      <h1>Contacts</h1>

      <form className="form-row" onSubmit={addContact}>
        <input
          placeholder="Phone (with country code, e.g. 919876543210)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <button type="submit">Add Contact</button>
      </form>

      <input
        className="search-box"
        placeholder="Search contacts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Tags</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{(c.tags || []).join(", ")}</td>
              <td>
                <button onClick={() => deleteContact(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
