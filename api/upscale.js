export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { image_url, scale = 4 } = req.body;
  if (!image_url) return res.status(400).json({ error: 'Thiếu image_url' });

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return res.status(500).json({ error: 'Chưa cấu hình API token' });

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b',
        input: {
          image: image_url,
          scale: scale,
          face_enhance: false,
        },
      }),
    });

    const prediction = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: prediction.detail || 'Lỗi Replicate API' });

    return res.status(200).json({ prediction_id: prediction.id, status: prediction.status });
  } catch (err) {
    return res.status(500).json({ error: 'Lỗi kết nối: ' + err.message });
  }
}
