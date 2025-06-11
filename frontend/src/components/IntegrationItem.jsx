import React from "react";

function IntegrationItem({ name, status, apiUrl }) {
  return (
    <div className="col-md-4 mb-4">
      <div className={`card h-100 border-${status === 'active' ? 'success' : 'danger'}`}>
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text"><strong>Status:</strong> {status}</p>
          <p className="card-text"><strong>API URL:</strong> {apiUrl}</p>
        </div>
      </div>
    </div>
  );
}

export default IntegrationItem;
