export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { video_url } = req.body;
  if (!video_url) return res.status(400).json({ error: 'Thiếu video_url' });

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
        version: 'b4f9a8b09ad5c60b2a2b34291b6f2318468d2d4b2e5c5e5a2a8e5c5e5a2a8e5c',
        input: {
          video_path: video_url,
          fps: 30,
        },
      }),
    });

    const prediction = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: prediction.detail || 'Lỗi xử lý video' });

    return res.status(200).json({ prediction_id: prediction.id, status: prediction.status });
  } catch (err) {
    return res.status(500).json({ error: 'Lỗi kết nối: ' + err.message });
  }
}
