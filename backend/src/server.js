console.log("Starting server.js...");
try {
  require('dotenv').config();
  const app = require('./app');
  const { Pool } = require('pg');

  const server = require('http').createServer(app);
  const io = require('socket.io')(server, {
    cors: {
      origin: "*", // Allow all for MVP dev
      methods: ["GET", "POST"]
    }
  });

  const PORT = process.env.PORT || 3000;
  console.log("Port:", PORT);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  pool.connect((err, client, release) => {
    if (err) {
      console.error('Error acquiring client', err.message);
    } else {
      console.log('Database connected successfully');
      release();
    }
  });

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Make io available in app (optional, or export it)
  app.set('io', io);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (e) {
  console.error("CRITICAL ERROR:", e);
}