export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-goog-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 核心改动：req.url 会自带 "/v1beta/models/..." 这样的完整路径
  // 我们直接把它拼接到 Google 官方域名后面，实现 100% 透明转发
  const targetUrl = 'https://generativelanguage.googleapis.com' + req.url;
  
  const apiKey = req.headers['x-goog-api-key'];
  if (!apiKey) {
    return res.status(400).json({ error: "Missing API Key" });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : null
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy Error", details: error.message });
  }
}
