export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-goog-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 无论请求路径是什么，我们都强制指向 Gemini 1.5 Flash 的生成接口
  const targetUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
  try {
    const response = await fetch(targetUrl, {
      method: 'POST', // 强制使用 POST
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': req.headers['x-goog-api-key']
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
