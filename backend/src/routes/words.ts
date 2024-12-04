import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = express.Router();

// Schema validation using Zod
const wordSchema = z.object({
    word: z.string(),
    type: z.enum(['letter', 'number', 'word']),
});

//Route to save a recognized word
// router.post('/', async (req, res) => {
//     try {
//         const parsedData = wordSchema.parse(req.body);

//         const savedWord = await prisma.word.create({
//             data: parsedData,
//         });

//         res.status(201).json(savedWord);
//     } catch (error) {
//         res.status(400).json({ error: error instanceof Error ? error.message : error });
//     }
// });

// Route to retrieve all words
router.get('/', async (req, res) => {
    const { type, page = 1, limit = 10 } = req.query;

    try {
        const where = type ? { type: type as string } : {};
        const words = await prisma.word.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });

        res.status(200).json(words);
    } catch (error) {
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
            { word: 'grape', type: 'word' },
            { word: 'orange', type: 'word' },
            { word: 'peach', type: 'word' },
            { word: 'pear', type: 'word' },
            { word: 'plum', type: 'word' },
            { word: 'car', type: 'word' },
            { word: 'boat', type: 'word' },
            { word: 'plane', type: 'word' },
            { word: 'train', type: 'word' },
            { word: 'bus', type: 'word' },
            { word: 'house', type: 'word' },
            { word: 'tree', type: 'word' },
            { word: 'flower', type: 'word' },
            { word: 'cloud', type: 'word' },
            { word: 'rain', type: 'word' },
            { word: 'sun', type: 'word' },
            { word: 'moon', type: 'word' },
            { word: 'star', type: 'word' },
            { word: 'hat', type: 'word' },
            { word: 'shoe', type: 'word' },
            { word: 'sock', type: 'word' },
            { word: 'shirt', type: 'word' },
            { word: 'pants', type: 'word' },
            { word: 'coat', type: 'word' },
            { word: 'book', type: 'word' },
            { word: 'pencil', type: 'word' },
            { word: 'pen', type: 'word' },
            { word: 'paper', type: 'word' },
            { word: 'desk', type: 'word' },
            { word: 'chair', type: 'word' },
            { word: 'bed', type: 'word' },
            { word: 'lamp', type: 'word' },
            { word: 'computer', type: 'word' },
            { word: 'mouse', type: 'word' },
            { word: 'keyboard', type: 'word' },
            { word: 'phone', type: 'word' },
            { word: 'tablet', type: 'word' },
            { word: 'camera', type: 'word' },
            { word: 'bottle', type: 'word' },
            { word: 'cup', type: 'word' },
            { word: 'plate', type: 'word' },
            { word: 'fork', type: 'word' },
            { word: 'spoon', type: 'word' },
            { word: 'knife', type: 'word' },
            { word: 'door', type: 'word' },
            { word: 'window', type: 'word' },
            { word: 'rug', type: 'word' },
            { word: 'towel', type: 'word' },
            { word: 'clock', type: 'word' },
        ];
        

        res.status(200).json(predefinedWords);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching words list.' });
    }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { word, type } = req.body;

    if (!word || !type || !["letter", "number", "word"].includes(type)) {
         res.status(400).json({ error: "Invalid word or type." });
         return
      }
    

  try {
    const savedWord = await prisma.word.upsert({
      where: { word },
      update: {}, // No updates to perform if the word exists
      create: { word, type },
    });

    res.status(201).json(savedWord);
  } catch (error) {
    console.error('Error adding word:', error);
    res.status(500).json({ error: 'Failed to add word.' });
  }
});




export default router;
