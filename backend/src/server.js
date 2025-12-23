console.log("Starting server.js...");
try {
  require('dotenv').config();
  const app = require('./app');
  const { Pool } = require('pg');

  const PORT = process.env.PORT || 3000;
  console.log("Port:", PORT);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  pool.connect((err, client, release) => {
    if (err) {
      console.error('Error acquiring client', err.message); // Changed to err.message
    } else {
      console.log('Database connected successfully');
      release();
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (e) {
  console.error("CRITICAL ERROR:", e);
}