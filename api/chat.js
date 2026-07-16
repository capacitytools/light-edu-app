export default async function handler(req, res) {
  // Allow requests from any origin (for testing)
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { message } = req.body;
  
  // Check if API key exists
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey || apiKey === 'PASTE_YOUR_GROQ_KEY_HERE') {
    console.error('❌ API Key is missing or not configured');
    return res.status(500).json({ 
      error: 'API key not configured',
      details: 'The server is missing the Groq API key. Check Vercel Environment Variables.'
    });
  }

  try {
    // Make the request to Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are Professor LIGHT, a friendly AI teacher. Keep responses helpful and concise.'
          },
          { role: 'user', content: message }
        ]
      })
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', response.status, errorText);
      
      if (response.status === 401) {
        return res.status(401).json({ 
          error: 'Invalid API Key',
          details: 'Your Groq API key is invalid or expired. Please check your key.'
        });
      }
      
      return res.status(response.status).json({ 
        error: 'Groq API Error',
        details: errorText
      });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({ 
        error: 'Unexpected response from AI',
        details: data
      });
    }

    // Success!
    return res.status(200).json({ 
      reply: data.choices[0].message.content 
    });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      details: error.message
    });
  }
}
