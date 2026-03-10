const express = require("express");
const router = express.Router();
const {
    createQuestion,
    getQuestions,
    getAdminQuestions,
    updateStatus,
    upvoteQuestion,
    updateQuestion,
    deleteQuestion
} = require("../controllers/questionController");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Improved Admin Auth Middleware using database
const adminAuth = async (req, res, next) => {
    const adminPass = req.headers['admin-password'];
    try {
        let settings = await prisma.adminSettings.findFirst();

        // Initialize if not exists
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

router.get("/", getQuestions);
router.post("/", createQuestion);
router.post("/:id/upvote", upvoteQuestion);

// Admin routes
router.get("/admin", adminAuth, getAdminQuestions);
router.patch("/:id/status", adminAuth, updateStatus);
router.put("/:id", adminAuth, updateQuestion);
router.delete("/:id", adminAuth, deleteQuestion);

// Password Management
router.patch("/admin/change-password", adminAuth, async (req, res) => {
    const { newPassword } = req.body;
    try {
        const settings = await prisma.adminSettings.findFirst();
        await prisma.adminSettings.update({
            where: { id: settings.id },
            data: { password: newPassword }
        });
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
