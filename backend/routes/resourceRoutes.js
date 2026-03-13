const express = require("express");
const router = express.Router();
const { createResource, getResources, deleteResource, updateResource } = require("../controllers/resourceController");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Admin Auth Middleware (Shared from questionRoutes)
const adminAuth = async (req, res, next) => {
    const adminPass = req.headers['admin-password'];
    try {
        let settings = await prisma.adminSettings.findFirst();
        if (!settings) {
            settings = await prisma.adminSettings.create({ data: { password: 'admin123' } });
        }
        if (adminPass === settings.password) {
            next();
        } else {
            res.status(403).json({ message: "Higher privilege required" });
        }
    } catch (err) {
        res.status(500).json({ message: "Auth error" });
    }
};

router.get("/", getResources);
router.post("/", adminAuth, createResource);
router.delete("/:id", adminAuth, deleteResource);
router.put("/:id", adminAuth, updateResource);

module.exports = router;
