import axios from 'axios';
import { GEMINI_API_KEY } from '../config/env.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Transcribe audio to text using Gemini Audio-to-Text API
 * @param {Buffer} audioBuffer - Audio file buffer
 * @param {string} mimeType - MIME type of audio (e.g., 'audio/mp3', 'audio/wav')
 * @returns {Promise<string>} - Transcript text
 */
export async function transcribeAudio(audioBuffer, mimeType = 'audio/mp3') {
  try {
    console.log('🎤 Transcribing audio with Gemini...');

    // Convert buffer to base64
    const base64Audio = audioBuffer.toString('base64');

    // Call Gemini API for audio transcription
    // Note: Gemini API endpoint may vary, using the standard approach
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
      {
        contents: [{
          parts: [{
            inlineData: {
              mimeType: mimeType,
              data: base64Audio
            }
          }]
        }]
      },
      {
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        params: {
          key: GEMINI_API_KEY
        }
      }
    );

    // Extract transcript from response
    const transcript = response.data.candidates[0].content.parts[0].text;
    console.log('✅ Transcription successful');
    return transcript;
  } catch (error) {
    console.error('❌ Transcription error:', error.response?.data || error.message);
    throw new Error(`Transcription failed: ${error.response?.data?.error?.message || error.message}`);
  }
}

/**
 * Summarize and simplify text using Gemini
 * @param {string} transcript - Original transcript text
 * @returns {Promise<string>} - Simplified summary
 */
export async function summarizeText(transcript) {
  try {
    console.log('📝 Summarizing text with Gemini...');

    const prompt = `Simplify and summarize this transcript for a neurodiverse student. Use short sentences and bullet points. Make it easy to read and understand.

Transcript:
${transcript}

Provide a clear, simplified summary:`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const summary = response.data.candidates[0].content.parts[0].text;
    console.log('✅ Summarization successful');
    return summary;
  } catch (error) {
    console.error('❌ Summarization error:', error.response?.data || error.message);
    throw new Error(`Summarization failed: ${error.response?.data?.error?.message || error.message}`);
  }
}

/**
 * Generate text-to-speech audio using Gemini TTS
 * Note: Gemini doesn't have a native TTS API, so we'll use a workaround
 * or integrate with Google Cloud Text-to-Speech API
 * @param {string} text - Text to convert to speech
 * @returns {Promise<Buffer>} - Audio buffer
 */
export async function textToSpeech(text) {
  try {
    console.log('🔊 Generating speech with Gemini TTS...');

    // Note: Gemini API doesn't have direct TTS endpoint
    // Using Google Cloud Text-to-Speech API as alternative
    // For now, we'll use a placeholder that can be replaced with actual TTS service
    
    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GEMINI_API_KEY}`,
      {
        input: { text: text },
        voice: {
          languageCode: 'en-US',
          name: 'en-US-Neural2-D',
          ssmlGender: 'NEUTRAL'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.9,
          pitch: 0
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Decode base64 audio
    const audioBuffer = Buffer.from(response.data.audioContent, 'base64');
    console.log('✅ TTS generation successful');
    return audioBuffer;
  } catch (error) {
    console.error('❌ TTS error:', error.response?.data || error.message);
    // Fallback: Return a note that TTS requires Google Cloud TTS API
    throw new Error(`TTS failed: ${error.response?.data?.error?.message || error.message}. Note: This requires Google Cloud Text-to-Speech API access.`);
  }
}

