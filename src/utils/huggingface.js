const API_URL =
  'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell';

function buildPrompt(userText) {
  const cleaned = userText.trim();
  return `ultra realistic oil painting of ${cleaned}, masterpiece, 8k, professional artist, canvas texture, thick brush strokes, dramatic lighting. negative prompt: blurry, lowres, text, watermark`;
}

export async function generateOilPainting(userText) {
  const token = import.meta.env.VITE_HUGGINGFACE_API_KEY;

  if (!token) {
    throw new Error('Missing Hugging Face API key. Add VITE_HUGGINGFACE_API_KEY to .env.');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: buildPrompt(userText)
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image generation failed: ${response.status} ${errorText}`);
  }

  const blob = await response.blob();
  return blob;
}
