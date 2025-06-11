const pool = require('../db'); // assuming you use pg pool

exports.getAllIntegrations = async (req, res) => {
  const result = await pool.query('SELECT * FROM integrations');
  res.json(result.rows);
};

exports.createIntegration = async (req, res) => {
  const { name, api_key, base_url, usage_limit } = req.body;
  const result = await pool.query(
    'INSERT INTO integrations (name, api_key, base_url, usage_limit) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, api_key, base_url, usage_limit]
  );
  res.status(201).json(result.rows[0]);
};

exports.updateIntegration = async (req, res) => {
  const { id } = req.params;
  const { name, api_key, base_url, usage_limit, is_active } = req.body;
  const result = await pool.query(
    `UPDATE integrations
     SET name = $1, api_key = $2, base_url = $3, usage_limit = $4, is_active = $5, updated_at = NOW()
     WHERE id = $6 RETURNING *`,
    [name, api_key, base_url, usage_limit, is_active, id]
  );
  res.json(result.rows[0]);
};

exports.deleteIntegration = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM integrations WHERE id = $1', [id]);
  res.status(204).send();
};
