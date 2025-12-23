const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async ({ username, email, password, role = 'VIEWER', organization, phone }) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const query = `
    INSERT INTO users (username, email, password_hash, role, organization, phone)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, username, email, role, organization, phone, created_at;
  `;

  const values = [username, email, passwordHash, role, organization, phone];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await db.query(query, [email]);
  return rows[0];
};

const findUserById = async (id) => {
  const query = 'SELECT id, username, email, role, organization, phone, created_at FROM users WHERE id = $1';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
