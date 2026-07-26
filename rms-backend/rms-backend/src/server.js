require('dotenv').config();
const app = require('./app');
const { pingDb } = require('./config/db');

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, async () => {
  console.log(`RMS backend running on http://localhost:${PORT}`);
  console.log(`Health check:  http://localhost:${PORT}/api/health`);
  try {
    await pingDb();
    console.log('MySQL connection: OK');
  } catch (err) {
    console.warn('MySQL connection: FAILED —', err.code || err.message);
    console.warn('The API is up, but queries will fail until MySQL is reachable and .env is correct.');
  }
});
