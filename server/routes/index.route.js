const express = require("express");
const router = express.Router();

const authRoutes = require('./auth.route');
const jobsRoutes = require('./jobs.route');

const authMiddleware = require('../middlewares/auth.middleware')

router.get("/api/v1/health", (req, res) => {
    res.json({
        data: null,
        message: 'Health Check'
    });
});

router.use("/api/v1/auth", authRoutes);

router.use("/api/v1/jobs", authMiddleware, jobsRoutes);

module.exports = router