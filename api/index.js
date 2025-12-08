// Vercel Serverless Function wrapper for Express backend
// This file is used by Vercel to handle /api/* requests

// Import the Express app from backend
import app from '../backend/server.js';

// Export as Vercel serverless function handler
// Vercel Serverless Functions expect a function that receives (req, res)
export default app;
