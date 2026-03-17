const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createResource = async (req, res) => {
    const { title, description, links, category } = req.body;
    try {
        const resource = await prisma.resource.create({
            data: { title, description, links, category }
        });
        res.status(201).json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getResources = async (req, res) => {
    try {
        const resources = await prisma.resource.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateResource = async (req, res) => {
    const { id } = req.params;
    const { title, description, links, category } = req.body;
    try {
        const resource = await prisma.resource.update({
            where: { id },
            data: { title, description, links, category }
        });
        res.json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteResource = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.resource.delete({ where: { id } });
        res.json({ message: "Resource deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
