function buildPrompt(userText) {
  const cleaned = userText.trim();
  return `ultra realistic oil painting of ${cleaned}, masterpiece, 8k, professional artist, canvas texture, thick brush strokes, dramatic lighting. negative prompt: blurry, lowres, text, watermark`;
}

export async function generateOilPainting(userText) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: buildPrompt(userText)
    })
  });

  if (!response.ok) {
    let message = `Image generation failed (${response.status})`;
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
      const errorText = await response.text();
      if (errorText) message = errorText;
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  return blob;
}
