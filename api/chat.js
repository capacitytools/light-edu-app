export default async function handler(req, res) {
  // Only allow POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Grab the secret key from Vercel's vault
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing the API Key' });
  }

  try {
    // Get the messages from your website
    const { messages, model = 'llama-3.1-8b-instant' } = req.body;

    // Send them to Groq securely
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Groq Error' });
    }

    // Send the answer back to your website
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
