import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Read audio file and return buffer
 * @param {string} filePath - Path to audio file
 * @returns {Promise<Buffer>} - Audio file buffer
 */
export async function readAudioFile(filePath) {
  try {
    const buffer = await fs.promises.readFile(filePath);
    return buffer;
  } catch (error) {
    throw new Error(`Failed to read audio file: ${error.message}`);
  }
}

/**
 * Get MIME type from file extension
 * @param {string} filename - File name
 * @returns {string} - MIME type
 */
export function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.m4a': 'audio/mp4',
    '.ogg': 'audio/ogg',
    '.webm': 'audio/webm'
  };
  return mimeTypes[ext] || 'audio/mpeg';
}

/**
 * Clean up temporary file
 * @param {string} filePath - Path to file to delete
 */
export async function cleanupFile(filePath) {
  try {
    await fs.promises.unlink(filePath);
    console.log(`🗑️ Cleaned up temporary file: ${filePath}`);
  } catch (error) {
    console.warn(`⚠️ Failed to cleanup file ${filePath}:`, error.message);
  }
}

