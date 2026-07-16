export default async function handler(req, res) {
  // Simple test - remove this after testing
  if (req.method === 'GET') {
    const apiKey = process.env.GROQ_API_KEY;
    return res.status(200).json({ 
      message: 'API is working!',
      hasKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0
    });
  }
  
  // ... rest of your POST code
