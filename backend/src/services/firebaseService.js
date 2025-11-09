import { db, storage } from '../config/env.js';
import admin from 'firebase-admin';
import { randomUUID } from 'crypto';

/**
 * Save a note to Firestore
 * @param {string} userId - User ID
 * @param {string} summary - Note summary text
 * @param {string} transcript - Original transcript (optional)
 * @returns {Promise<Object>} - Saved note document
 */
export async function saveNote(userId, summary, transcript = '') {
  try {
    console.log(`💾 Saving note for user: ${userId}`);

    const noteData = {
      userId,
      summary,
      transcript,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString(),
      id: randomUUID()
    };

    const docRef = await db.collection('notes').add(noteData);
    console.log(`✅ Note saved with ID: ${docRef.id}`);

    return {
      id: docRef.id,
      ...noteData
    };
  } catch (error) {
    console.error('❌ Error saving note:', error.message);
    throw new Error(`Failed to save note: ${error.message}`);
  }
}

/**
 * Get all notes for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of note documents
 */
export async function getNotes(userId) {
  try {
    console.log(`📖 Fetching notes for user: ${userId}`);

    const snapshot = await db.collection('notes')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    const notes = [];
    snapshot.forEach(doc => {
      notes.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`✅ Found ${notes.length} notes`);
    return notes;
  } catch (error) {
    console.error('❌ Error fetching notes:', error.message);
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }
}

/**
 * Upload audio file to Firebase Storage
 * @param {Buffer} audioBuffer - Audio file buffer
 * @param {string} fileName - Name for the file
 * @returns {Promise<string>} - Public URL of uploaded file
 */
export async function uploadAudioToStorage(audioBuffer, fileName) {
  try {
    console.log(`☁️ Uploading audio to Firebase Storage: ${fileName}`);

    // Get default bucket (or specify bucket name if needed)
    const bucket = storage.bucket();
    const file = bucket.file(`audio/${fileName}`);

    await file.save(audioBuffer, {
      metadata: {
        contentType: 'audio/mpeg',
      },
    });

    // Make file publicly accessible
    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    console.log(`✅ Audio uploaded: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('❌ Error uploading audio:', error.message);
    throw new Error(`Failed to upload audio: ${error.message}`);
  }
}

