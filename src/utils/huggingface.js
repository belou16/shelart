function buildPrompt(userText) {
  const cleaned = userText.trim();
  return `ultra realistic oil painting of ${cleaned}, masterpiece, 8k, professional artist, canvas texture, thick brush strokes, dramatic lighting. negative prompt: blurry, lowres, text, watermark`;
}

function base64ToBlob(base64, mimeType = 'image/png') {
  const cleaned = base64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
  const binary = atob(cleaned);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

async function parseImageResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('image/')) {
    return response.blob();
  }

  if (contentType.includes('application/json')) {
    const data = await response.json();

    const maybeBase64 =
      data?.image || data?.generated_image || data?.b64_json || data?.[0]?.b64_json;

    if (typeof maybeBase64 === 'string' && maybeBase64.length > 0) {
      return base64ToBlob(maybeBase64);
    }

    const maybeUrl = data?.url || data?.image_url || data?.[0]?.url;
    if (typeof maybeUrl === 'string' && maybeUrl.startsWith('http')) {
      const imageResponse = await fetch(maybeUrl);
      if (!imageResponse.ok) {
        throw new Error('Model returned an image URL, but download failed.');
      }
      return imageResponse.blob();
    }

    if (data?.error) {
      throw new Error(data.error);
    }
  }

  return response.blob();
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

  const blob = await parseImageResponse(response);

  if (!blob || blob.size === 0) {
    throw new Error('Generated image is empty. Please try another prompt.');
  }

  return blob;
}
