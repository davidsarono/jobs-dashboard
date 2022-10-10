const express = require("express");
const router = express.Router();

const authRoutes = require('./auth.route');

router.get("/api/v1/health", (req, res) => {
    res.json({
        data: null,
        message: 'Health Check'
    });
});

router.use("/api/v1/auth", authRoutes)

module.exports = router