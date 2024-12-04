import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import wordsRoutes from './routes/words';

dotenv.config();  // Load environment variables from .env file 
const PORT = process.env.PORT;  // Retrieve the environment variable 

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Reading Detection App API');
});

app.use('/api/words', wordsRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
