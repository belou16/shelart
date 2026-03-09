const HF_URL =
  'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.VITE_HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY;

  if (!token) {
    res.status(500).json({ error: 'Missing Hugging Face API key on server' });
    return;
  }

  try {
    const hfResponse = await fetch(HF_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const contentType = hfResponse.headers.get('content-type') || '';
    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      res.status(hfResponse.status).json({
        error: `Hugging Face error ${hfResponse.status}: ${errorText}`
      });
      return;
    }

    if (contentType.includes('image/')) {
      const arrayBuffer = await hfResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.setHeader('Content-Type', contentType);
      res.status(200).send(buffer);
      return;
    }

    const payload = await hfResponse.text();
    res.status(502).json({ error: `Unexpected response from model: ${payload}` });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to contact Hugging Face' });
  }
}
