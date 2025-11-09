# MindScribe Backend API

AI-powered note-taking assistant backend for neurodiverse students.

## 🚀 Features

- **Audio Transcription**: Convert audio files (mp3, wav) to text using Google Gemini API
- **Text Summarization**: Simplify and summarize transcripts for easy reading
- **Text-to-Speech**: Generate audio from text using Google Cloud TTS
- **Note Management**: Save and retrieve notes from Firestore
- **Firebase Storage**: Store generated audio files

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key
- Firebase project with Firestore and Storage enabled
- Firebase Admin SDK credentials

## 🛠️ Installation

1. **Clone the repository** (if applicable) or navigate to the backend directory:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your credentials:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     FIREBASE_PROJECT_ID=your_project_id
     FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
     FIREBASE_CLIENT_EMAIL=your_client_email@your-project.iam.gserviceaccount.com
     PORT=3000
     NODE_ENV=development
     ```

4. **Get Firebase credentials**:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate a new private key
   - Copy the `project_id`, `private_key`, and `client_email` to your `.env` file

5. **Get Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

## 🏃 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### 1. Transcribe Audio
```
POST /api/transcribe
Content-Type: multipart/form-data
Body: audio file (mp3, wav, m4a, ogg, webm)
```

**Response:**
```json
{
  "success": true,
  "transcript": "Transcribed text here..."
}
```

### 2. Summarize Text
```
POST /api/summarize
Content-Type: application/json
Body: { "transcript": "Text to summarize..." }
```

**Response:**
```json
{
  "success": true,
  "summary": "Simplified summary with bullet points..."
}
```

### 3. Text-to-Speech
```
POST /api/tts
Content-Type: application/json
Body: { "text": "Text to convert to speech..." }
```

**Response:**
```json
{
  "success": true,
  "audioUrl": "https://storage.googleapis.com/..."
}
```

### 4. Save Note
```
POST /api/saveNote
Content-Type: application/json
Body: {
  "userId": "user123",
  "summary": "Note summary...",
  "transcript": "Original transcript..." (optional)
}
```

**Response:**
```json
{
  "success": true,
  "status": "saved",
  "note": {
    "id": "note-id",
    "userId": "user123",
    "summary": "Note summary...",
    "timestamp": "...",
    "createdAt": "..."
  }
}
```

### 5. Get Notes
```
GET /api/notes?userId=user123
```

**Response:**
```json
{
  "success": true,
  "notes": [
    {
      "id": "note-id",
      "userId": "user123",
      "summary": "Note summary...",
      "timestamp": "...",
      "createdAt": "..."
    }
  ],
  "count": 1
}
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                 # Main Express app
│   ├── routes/
│   │   ├── transcribe.js      # POST /api/transcribe
│   │   ├── summarize.js       # POST /api/summarize
│   │   ├── tts.js             # POST /api/tts
│   │   ├── notes.js           # POST /api/saveNote, GET /api/notes
│   │   └── index.js           # Route aggregator
│   ├── services/
│   │   ├── geminiService.js   # Gemini API calls
│   │   └── firebaseService.js # Firestore operations
│   ├── middleware/
│   │   └── errorHandler.js   # Error handling middleware
│   ├── utils/
│   │   └── fileHandler.js     # File upload utilities
│   └── config/
│       └── env.js             # Environment config & Firebase init
├── package.json
├── .env                       # Environment variables (not in git)
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | Yes |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | Yes |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment mode | No (default: development) |

## 🐛 Error Handling

All errors are handled by centralized middleware and return JSON responses:

```json
{
  "success": false,
  "error": {
    "message": "Error message here"
  }
}
```

## 📝 Notes

- Audio files are temporarily stored in `uploads/` directory and cleaned up after processing
- Generated TTS audio files are stored in Firebase Storage under `audio/` path
- Notes are stored in Firestore collection `notes`
- All timestamps are stored in ISO format

## 🔒 Security

- Never commit `.env` file to version control
- Keep API keys secure
- Use environment variables for all sensitive data
- Enable Firebase Security Rules for Firestore and Storage

## 📚 Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **multer**: File upload handling
- **axios**: HTTP client for API calls
- **firebase-admin**: Firebase Admin SDK

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC

