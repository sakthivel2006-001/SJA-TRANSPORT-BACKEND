require('dotenv').config();
console.log("NODE_ENV =", process.env.NODE_ENV);
console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🚛  SJA TRANSPORT API`);
    console.log(`    Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`    Port        : ${PORT}`);
    console.log(`    URL         : http://localhost:${PORT}/api/health\n`);
  });
};

startServer();
