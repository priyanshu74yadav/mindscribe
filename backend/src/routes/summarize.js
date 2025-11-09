import express from 'express';
import { summarizeText } from '../services/geminiService.js';

const router = express.Router();

/**
 * POST /api/summarize
 * Summarize and simplify transcript text using Gemini
 */
router.post('/', async (req, res, next) => {
  try {
    const { transcript } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Transcript text is required' }
      });
    }

    if (transcript.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Transcript cannot be empty' }
      });
    }

    console.log(`📝 Summarizing transcript (${transcript.length} characters)...`);

    // Summarize text
    const summary = await summarizeText(transcript);

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    next(error);
  }
});

export default router;

