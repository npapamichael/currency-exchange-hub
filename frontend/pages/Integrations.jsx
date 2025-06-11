import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Integrations() {
  const [integrations, setIntegrations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    api_key: "",
    base_url: "",
    usage_limit: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
  try {
    const res = await axios.get("/api/integrations");
    console.log("✅ Integrations fetched:", res.data);

    setIntegrations(res.data);
    setError(""); // ✅ clear old errors
  } catch (err) {
    console.error("❌ Error fetching integrations:", err.message);
    setError("Failed to load integrations.");
  }
};

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/integrations/${editingId}`, {
          ...form,
          is_active: true,
        });
      } else {
        await axios.post("/api/integrations", form);
      }
      resetForm();
      fetchIntegrations();
    } catch {
      setError("Error saving integration.");
    }
  };

  const handleEdit = (integration) => {
    setForm({
      name: integration.name,
      api_key: integration.api_key,
      base_url: integration.base_url,
      usage_limit: integration.usage_limit,
    });
    setEditingId(integration.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/integrations/${id}`);
    fetchIntegrations();
  };

  const resetForm = () => {
    setForm({ name: "", api_key: "", base_url: "", usage_limit: 0 });
    setEditingId(null);
    setError("");
  };

  return (
    <div className="container">
      {/* Back Button */}
      <button
        className="btn btn-outline-light mb-4"
        onClick={() => navigate("/")}
      >
        ← Back to Exchange Rates
      </button>

      <h2>Manage Integrations</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-select"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">API Key</label>
          <input
            className="form-select"
            name="api_key"
            value={form.api_key}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Base URL</label>
          <input
            className="form-select"
            name="base_url"
            value={form.base_url}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Usage Limit</label>
          <input
            className="form-select"
            type="number"
            name="usage_limit"
            value={form.usage_limit}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Integration" : "Create Integration"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Base URL</th>
            <th>Usage Limit</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {integrations.map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.base_url}</td>
              <td>{i.usage_limit}</td>
              <td>{i.is_active ? "Yes" : "No"}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-info me-2"
                  onClick={() => handleEdit(i)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(i.id)}
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Integrations;
