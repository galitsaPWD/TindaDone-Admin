export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { deviceId } = req.query;
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    return res.status(500).json({ message: 'KV Database not configured' });
  }

  if (!deviceId) {
    return res.status(400).json({ message: 'Device ID required' });
  }

  try {
    // Check if ID exists in KV
    const response = await fetch(`${KV_URL}/get/trial:${deviceId}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
    const data = await response.json();

    if (data.result) {
      return res.status(200).json({ exists: true, startTime: data.result });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}
