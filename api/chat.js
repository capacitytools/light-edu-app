export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { message } = req.body;
  // This grabs the secret key from Vercel!
  const apiKey = process.env.GROQ_API_KEY;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system", 
            content: "You are Professor LIGHT, a friendly AI teacher for Nigerian students. Explain simply, use emojis, and be encouraging."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "AI didn't reply" });
    }
  } catch (error) {
    res.status(500).json({ error: "Connection failed" });
  }
}
