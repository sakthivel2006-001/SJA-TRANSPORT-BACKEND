const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const contactRoutes = require('./routes/contactRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const transportServiceRoutes = require('./routes/transportServiceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

const routeModules = [
  { prefix: '/api/auth', router: authRoutes },
  { prefix: '/api/bookings', router: bookingRoutes },
  { prefix: '/api/feedback', router: feedbackRoutes },
  { prefix: '/api/gallery', router: galleryRoutes },
  { prefix: '/api/achievements', router: achievementRoutes },
  { prefix: '/api/contact', router: contactRoutes },
  { prefix: '/api/vehicles', router: vehicleRoutes },
  { prefix: '/api/services', router: transportServiceRoutes },
  { prefix: '/api/dashboard', router: dashboardRoutes },
  { prefix: '/api/admin', router: adminRoutes },
];

const buildRouteSummary = () => {
  const routes = [{ method: 'GET', path: '/api/health' }];

  routeModules.forEach(({ prefix, router }) => {
    const stack = router?.stack || [];
    stack.forEach((layer) => {
      if (!layer.route) return;

      const routePath = layer.route.path === '/' ? prefix : `${prefix}${layer.route.path}`;
      Object.keys(layer.route.methods).forEach((method) => {
        if (layer.route.methods[method]) {
          routes.push({ method: method.toUpperCase(), path: routePath });
        }
      });
    });
  });

  return routes;
};

const logRouteSummary = (routes) => {
  const requiredRoutes = [
    '/api/auth/login',
    '/api/bookings',
    '/api/feedback',
    '/api/contact',
    '/api/gallery',
    '/api/services',
    '/api/vehicles',
  ];

  const availableRoutes = new Set(routes.map((route) => route.path));

  console.log('\n📦 Registered Express routes');
  console.table(routes.map(({ method, path }) => ({ method, path })));

  console.log('\n✅ Startup route check');
  console.table(requiredRoutes.map((route) => ({
    route,
    status: availableRoutes.has(route) ? '✓' : '✗',
  })));
};

// ── Security ────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
}));

// ── Body Parsers ────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'SJA TRANSPORT API is running' });
});

// ── API Routes ──────────────────────────────────────────────────────
routeModules.forEach(({ prefix, router }) => {
  app.use(prefix, router);
});

// ── 404 Handler ─────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ────────────────────────────────────────────
app.use(errorHandler);

logRouteSummary(buildRouteSummary());

module.exports = app;
