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

  // Base URL for backend API, set in .env as VITE_API_BASE_URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  // Fetch integrations from backend
  const fetchIntegrations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/integrations`);
      setIntegrations(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load integrations.");
    }
  };

  // Run once on component mount
  useEffect(() => {
    fetchIntegrations();
  }, []);

  // Handle input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Submit form for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.api_key || !form.base_url) {
      setError("All fields are required.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/api/integrations/${editingId}`,
          { ...form, is_active: true }
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/integrations`, form);
      }
      resetForm();
      await fetchIntegrations();
      setError("");
    } catch {
      setError("Error saving integration.");
    }
  };

  // Load integration data into form for editing
  const handleEdit = (integration) => {
    setForm({
      name: integration.name,
      api_key: integration.api_key,
      base_url: integration.base_url,
      usage_limit: integration.usage_limit,
    });
    setEditingId(integration.id);
  };

  // Deactivate (delete) integration
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/integrations/${id}`);
      await fetchIntegrations();
      setError("");
    } catch {
      setError("Error deactivating integration.");
    }
  };

  // Reset form to initial state
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