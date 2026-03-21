const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const groqService = require("../utils/groqService");

exports.createQuestion = async (req, res) => {
    const { company, role, techStack, difficulty, category, interviewRound, description, experience } = req.body;
    try {
        const question = await prisma.question.create({
            data: {
                company,
                role,
                techStack,
                difficulty,
                category,
                interviewRound,
                description,
                experience,
                status: "PENDING"
            }
        });
        res.status(201).json(question);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getQuestions = async (req, res) => {
    const { page = 1, limit = 10, company, techStack, difficulty, category, role, interviewRound, excludeRound } = req.query;
    const skip = (page - 1) * limit;

    const where = { status: "APPROVED" };
    if (company) where.company = { contains: company, mode: 'insensitive' };
    if (techStack) {
        const terms = techStack.split(',').map(t => t.trim());
        where.OR = [
            { techStack: { hasSome: terms } },
            ...terms.map(term => ({ role: { contains: term, mode: 'insensitive' } }))
        ];
    }
    if (difficulty) where.difficulty = difficulty;
    if (category) where.category = category;
    if (role) where.role = { contains: role, mode: 'insensitive' };
    if (interviewRound) {
        where.interviewRound = interviewRound;
    } else if (excludeRound) {
        where.interviewRound = { not: excludeRound };
    }

    try {
        const [questions, total] = await Promise.all([
            prisma.question.findMany({
                where,
                skip: parseInt(skip),
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.question.count({ where })
        ]);

        res.json({
            questions,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAdminQuestions = async (req, res) => {
    const { status } = req.query;
    try {
        const questions = await prisma.question.findMany({
            where: status ? { status } : {},
            orderBy: { createdAt: 'desc' }
        });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        let question = await prisma.question.findUnique({ where: { id } });
        if (!question) return res.status(404).json({ message: "Question not found" });

        // If approving and no answer exists, generate one
        let aiAnswer = question.answer;
        if (status === "APPROVED" && !question.answer) {
            aiAnswer = await groqService.generateAnswer(question);
        }

        question = await prisma.question.update({
            where: { id },
            data: { 
                status,
                answer: aiAnswer
            }
        });

        // Emit realtime update if approved
        if (status === "APPROVED") {
            const io = req.app.get("socketio");
            io.emit("newQuestion", question);
        }

        res.json(question);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.upvoteQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const question = await prisma.question.update({
            where: { id },
            data: {
                upvotes: {
                    push: "anonymous_vote_" + Date.now()
                }
            }
        });
        res.json(question);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await prisma.question.update({
            where: { id },
            data: req.body
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.bookmarkQuestion = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const question = await prisma.question.findUnique({ where: { id } });
        if (!question) return res.status(404).json({ message: 'Question not found' });
        
        const bookmarks = question.bookmarks || [];
        const exists = bookmarks.includes(userId);
        
        const updatedQuestion = await prisma.question.update({
            where: { id },
            data: {
                bookmarks: exists 
                    ? { set: bookmarks.filter(b => b !== userId) }
                    : { push: userId }
            }
        });
        res.json(updatedQuestion);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.question.delete({ where: { id } });
        res.json({ message: "Question deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        let stats = await prisma.adminSettings.findFirst();
        if (!stats) {
            stats = await prisma.adminSettings.create({ data: {} });
        }
        res.json({
            placedStudents: stats.placedStudents,
            totalStudents: stats.totalStudents
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateStats = async (req, res) => {
    const { placedStudents, totalStudents } = req.body;
    try {
        let stats = await prisma.adminSettings.findFirst();
        if (!stats) {
            stats = await prisma.adminSettings.create({ data: {} });
        }
        const updated = await prisma.adminSettings.update({
            where: { id: stats.id },
            data: {
                placedStudents: parseInt(placedStudents),
                totalStudents: parseInt(totalStudents)
            }
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.importQuestions = async (req, res) => {
    const { questions } = req.body;
    if (!Array.isArray(questions)) {
        return res.status(400).json({ message: "Invalid data format. Expected an array of questions." });
    }

    try {
        // Map questions to ensure correct data types and status
        const questionsToImport = questions.map(q => ({
            company: q.company,
            role: q.role,
            techStack: Array.isArray(q.techStack) ? q.techStack : [],
            difficulty: q.difficulty,
            category: q.category || "TECHNICAL",
            interviewRound: q.interviewRound,
            description: q.description,
            experience: q.experience || "",
            answer: q.answer || "",
            status: "APPROVED"
        }));

        const result = await prisma.question.createMany({
            data: questionsToImport
        });

        res.status(201).json({ 
            message: `Successfully imported ${result.count} questions.`,
            count: result.count 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
