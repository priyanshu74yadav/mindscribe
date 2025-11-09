import express from 'express';
import { saveNote, getNotes } from '../services/firebaseService.js';

const router = express.Router();

/**
 * POST /api/saveNote
 * Save a note to Firestore
 */
router.post('/saveNote', async (req, res, next) => {
  try {
    const { userId, summary, transcript } = req.body;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' }
      });
    }

    if (!summary || typeof summary !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'summary is required' }
      });
    }

    console.log(`💾 Saving note for user: ${userId}`);

    // Save note to Firestore
    const note = await saveNote(userId, summary, transcript || '');

    res.json({
      success: true,
      status: 'saved',
      note
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/notes
 * Get all notes for a user
 */
router.get('/notes', async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'userId query parameter is required' }
      });
    }

    console.log(`📖 Fetching notes for user: ${userId}`);

    // Get notes from Firestore
    const notes = await getNotes(userId);

    res.json({
      success: true,
      notes,
      count: notes.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;

