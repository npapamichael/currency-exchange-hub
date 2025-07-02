import React, { useState, useEffect } from "react";

export default function CurrencyConverter({ base }) {
  const [amount, setAmount] = useState(1);
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState(base);
  const [toCurrency, setToCurrency] = useState("");
  const [conversionRate, setConversionRate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://api.frankfurter.app/currencies")
      .then((res) => res.json())
      .then((data) => {
        setCurrencies(Object.entries(data));
        if (!fromCurrency) setFromCurrency(base);
        if (!toCurrency) setToCurrency("EUR");
        setError(null);
      })
      .catch(() => setError("Failed to load currencies"));
  }, []);

  useEffect(() => {
    if (!fromCurrency || !toCurrency) return;

    if (fromCurrency === toCurrency) {
      setConversionRate(1);
      return;
    }

    setError(null);
    setConversionRate(null);

    fetch(
      `https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates && data.rates[toCurrency]) {
          setConversionRate(data.rates[toCurrency]);
        } else {
          setError("Failed to fetch conversion rate");
          setConversionRate(null);
        }
      })
      .catch(() => {
        setError("Network error fetching conversion");
        setConversionRate(null);
      });
  }, [fromCurrency, toCurrency]);

  return (
    <section className="compare-section">
      <h2>Compare Two Currencies</h2>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div>
          <label className="form-label" htmlFor="fromCurrency">
            From:
          </label>
          <select
            id="fromCurrency"
            className="form-select"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencies.map(([code, name]) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
        </div>
<div style={{ marginTop: "0rem" }}>
  <label className="form-label" htmlFor="amount">Amount:</label>
  <input
    id="amount"
    type="number"
    min="0"
    className="form-input"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    style={{ width: "140px" }}
    placeholder="Enter amount"
  />
</div>

        <div>
          <label className="form-label" htmlFor="toCurrency">
            To:
          </label>
          <select
            id="toCurrency"
            className="form-select"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencies.map(([code, name]) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: "2rem", fontWeight: "700", fontSize: "1.2rem" }}>
        {error && <p style={{ color: "#f87171" }}>{error}</p>}
        {conversionRate !== null ? (
          <p>
           <p>
  {amount} {fromCurrency} = {(amount * conversionRate).toFixed(4)} {toCurrency}
</p>

          </p>
        ) : (
          !error && <p>Loading conversion rate...</p>
        )}
      </div>
    </section>
  );
}
