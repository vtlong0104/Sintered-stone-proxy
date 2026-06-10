export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Thiếu prediction ID' });

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return res.status(500).json({ error: 'Chưa cấu hình API token' });

  try {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { 'Authorization': `Token ${token}` },
    });

    const prediction = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: prediction.detail || 'Lỗi kiểm tra trạng thái' });

    return res.status(200).json({
      status: prediction.status,
      output: prediction.output || null,
      error: prediction.error || null,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Lỗi kết nối: ' + err.message });
  }
}
