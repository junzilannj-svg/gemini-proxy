export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-goog-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 这里的目标地址是 Google 官方接口
  const targetUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
  const apiKey = req.headers['x-goog-api-key'];
  if (!apiKey) {
    return res.status(400).json({ error: "Missing API Key", message: "请在 Header 中包含 x-goog-api-key" });
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy Error", details: error.message });
  }
}
