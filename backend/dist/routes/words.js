"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// Schema validation using Zod
const wordSchema = zod_1.z.object({
    word: zod_1.z.string(),
    type: zod_1.z.enum(['letter', 'number', 'word']),
});
//Route to save a recognized word
router.post('/', async (req, res) => {
    try {
        const parsedData = wordSchema.parse(req.body);
        const savedWord = await prisma.word.create({
            data: parsedData,
        });
        res.status(201).json(savedWord);
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : error });
    }
});
// Route to retrieve all words
router.get('/', async (req, res) => {
    const { type, page = 1, limit = 10 } = req.query;
    try {
        const where = type ? { type: type } : {};
        const words = await prisma.word.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });
        res.status(200).json(words);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
});
// Add to the words routes
router.get('/list', async (req, res) => {
    try {
        const predefinedWords = [
            { word: 'please', type: 'word' },
            { word: 'cat', type: 'word' },
            { word: 'dog', type: 'word' },
            { word: 'apple', type: 'word' },
            { word: 'banana', type: 'word' },
            { word: 'fish', type: 'word' },
            { word: '1', type: 'number' },
            { word: '2', type: 'number' },
        ];
        res.status(200).json(predefinedWords);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching words list.' });
    }
});
router.post('/', async (req, res) => {
    const { word, type } = req.body;
    if (!word || !type) {
        res.status(400).json({ error: 'Both "word" and "type" fields are required.' });
        return;
    }
    try {
        const savedWord = await prisma.word.upsert({
            where: { word },
            update: {}, // No updates to perform if the word exists
            create: { word, type },
        });
        res.status(201).json(savedWord);
    }
    catch (error) {
        console.error('Error adding word:', error);
        res.status(500).json({ error: 'Failed to add word.' });
    }
});
exports.default = router;
