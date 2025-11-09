import express from 'express';
import { textToSpeech } from '../services/geminiService.js';
import { uploadAudioToStorage } from '../services/firebaseService.js';
import { randomUUID } from 'crypto';

const router = express.Router();

/**
 * POST /api/tts
 * Generate text-to-speech audio and upload to Firebase Storage
 */
router.post('/', async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Text is required' }
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Text cannot be empty' }
      });
    }

    console.log(`🔊 Generating TTS for text (${text.length} characters)...`);

    // Generate audio from text
    const audioBuffer = await textToSpeech(text);

    // Upload to Firebase Storage
    const fileName = `tts_${randomUUID()}.mp3`;
    const audioUrl = await uploadAudioToStorage(audioBuffer, fileName);

    res.json({
      success: true,
      audioUrl
    });
  } catch (error) {
    next(error);
  }
});

export default router;

