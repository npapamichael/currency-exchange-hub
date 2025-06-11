import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ExchangeRates from "./components/ExchangeRates";
import CurrencyConverter from "./components/CurrencyConverter";
import Integrations from "../pages/Integrations";
import "./App.css";

const API_OPTIONS = {
  frankfurter: {
    name: "Frankfurter",
    url: (base) => `https://api.frankfurter.app/latest?from=${base}`,
    parseRates: (data) => data.rates,
  },
  exchangerateapi: {
    name: "ExchangeRate-API",
    url: (base) =>
      `https://v6.exchangerate-api.com/v6/6e149665dad636647effde62/latest/${base}`,
    parseRates: (data) => data.conversion_rates,
  },
};

function MainPage() {
  const [rates, setRates] = useState({});
  const [prevRates, setPrevRates] = useState({});
  const [base, setBase] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [api, setApi] = useState("frankfurter");
  const prevRatesRef = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;

    async function fetchRates() {
      setLoading(true);
      setError(null);
      try {
        const apiConfig = API_OPTIONS[api];
        const response = await fetch(apiConfig.url(base));
        const data = await response.json();
        const newRates = apiConfig.parseRates(data);
        if (!newRates) throw new Error("Invalid data");

        setPrevRates(rates);
        prevRatesRef.current = rates;
        setRates(newRates);
        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        setError("Failed to fetch rates");
        setRates({});
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
    intervalId = setInterval(fetchRates, 60000);
    return () => clearInterval(intervalId);
  }, [base, api]);

  return (
    <div className="container">
      <h1 style={{ color: "#fff" }}>Exchange Rates</h1>

      <div className="d-flex flex-wrap gap-3 mb-3 align-items-center justify-content-between">
        <div>
          <label className="form-label">Select API:</label>
          <select
            className="form-select"
            value={api}
            onChange={(e) => setApi(e.target.value)}
          >
            {Object.entries(API_OPTIONS).map(([key, val]) => (
              <option key={key} value={key}>
                {val.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ color: "#bbb", fontWeight: 600 }}>
          Last updated: {lastUpdated || "N/A"}
        </div>
      </div>

      <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
        <label className="form-label">Base Currency:</label>
        <select
          className="form-select"
          value={base}
          onChange={(e) => setBase(e.target.value)}
        >
          {["USD", "EUR", "GBP", "AUD", "JPY", "CAD", "CHF"].map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>

        <button
          className="btn btn-outline-light"
          onClick={() => navigate("/integrations")}
        >
          Manage API Integrations
        </button>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading rates...</p>}
      {error && (
        <p style={{ color: "#f87171", textAlign: "center" }}>{error}</p>
      )}

      {!loading && !error && (
        <>
          <CurrencyConverter base={base} />
          <ExchangeRates
            rates={rates}
            prevRates={prevRatesRef.current}
            base={base}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<MainPage />} />
      <Route path="/integrations" element={<Integrations />} />
    </Routes>
  );
}
