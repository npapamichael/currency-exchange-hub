import React, { useState } from "react";

export default function ExchangeRates({ rates, prevRates, base }) {
  const [search, setSearch] = useState("");

  const getTrendClass = (currency) => {
    if (!prevRates || !prevRates[currency]) return "";
    if (rates[currency] > prevRates[currency]) return "text-success";
    if (rates[currency] < prevRates[currency]) return "text-danger";
    return "";
  };

  const getTrendArrow = (currency) => {
    if (!prevRates || !prevRates[currency]) return null;
    if (rates[currency] > prevRates[currency]) return "▲";
    if (rates[currency] < prevRates[currency]) return "▼";
    return "→";
  };

  const filteredRates = Object.entries(rates).filter(([currency]) =>
    currency.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <label className="form-label" htmlFor="searchCurrency">Search Currency:</label>
        <input
          id="searchCurrency"
          type="text"
          className="form-select"
          placeholder="e.g. EUR, GBP"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="list-group">
        {filteredRates.map(([currency, rate]) => (
          <li key={currency} className="list-group-item">
            <span>{currency}</span>
            <span>
              {rate.toFixed(4)}
              <span className={getTrendClass(currency)} style={{ marginLeft: 6 }}>
                {getTrendArrow(currency)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
