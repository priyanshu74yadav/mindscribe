import express from 'express';
import transcribeRouter from './transcribe.js';
import summarizeRouter from './summarize.js';
import ttsRouter from './tts.js';
import notesRouter from './notes.js';

const router = express.Router();

// Mount all routes with /api prefix
router.use('/api/transcribe', transcribeRouter);
router.use('/api/summarize', summarizeRouter);
router.use('/api/tts', ttsRouter);
router.use('/api', notesRouter); // Notes routes already have /api prefix in their paths

export default router;

