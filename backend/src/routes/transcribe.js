import express from 'express';
import multer from 'multer';
import { transcribeAudio } from '../services/geminiService.js';
import { getMimeType, cleanupFile } from '../utils/fileHandler.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg', 'audio/webm'];
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|m4a|ogg|webm)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files (mp3, wav, m4a, ogg, webm) are allowed.'));
    }
  }
});

/**
 * POST /api/transcribe
 * Transcribe audio file to text using Gemini
 */
router.post('/', upload.single('audio'), async (req, res, next) => {
  let tempFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No audio file provided' }
      });
    }

    tempFilePath = req.file.path;
    console.log(`📁 Received audio file: ${req.file.originalname} (${req.file.size} bytes)`);

    // Read audio file
    const audioBuffer = await fs.promises.readFile(tempFilePath);
    const mimeType = getMimeType(req.file.originalname);

    // Transcribe audio
    const transcript = await transcribeAudio(audioBuffer, mimeType);

    // Clean up temporary file
    await cleanupFile(tempFilePath);
    tempFilePath = null;

    res.json({
      success: true,
      transcript
    });
  } catch (error) {
    // Clean up temporary file on error
    if (tempFilePath) {
      await cleanupFile(tempFilePath);
    }
    next(error);
  }
});

export default router;

