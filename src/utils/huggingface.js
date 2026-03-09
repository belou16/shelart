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

async function isLikelyImageBlob(blob) {
  if (!blob || blob.size === 0) return false;
  if (blob.type.startsWith('image/')) return true;

  if (blob.type === '' || blob.type === 'application/octet-stream') {
    const headerBuffer = await blob.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(headerBuffer);

    const isPng =
      bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isGif = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
    const isWebp =
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50;

    return isPng || isJpeg || isGif || isWebp;
  }

  return false;
}

function extractImageDataFromJson(data) {
  const maybeBase64 =
    data?.image ||
    data?.generated_image ||
    data?.b64_json ||
    data?.[0]?.b64_json ||
    data?.[0]?.image;

  const maybeUrl = data?.url || data?.image_url || data?.[0]?.url;

  return { maybeBase64, maybeUrl, error: data?.error };
}

async function parseImageResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('image/')) {
    const blob = await response.blob();
    if (await isLikelyImageBlob(blob)) return blob;
    throw new Error('Server returned invalid image data.');
  }

  if (contentType.includes('application/json') || contentType.includes('text/')) {
    const rawText = await response.text();

    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch {
      if (rawText.startsWith('http')) {
        const imageResponse = await fetch(rawText);
        if (!imageResponse.ok) {
          throw new Error('Model returned an image URL, but download failed.');
        }
        const blob = await imageResponse.blob();
        if (await isLikelyImageBlob(blob)) return blob;
        throw new Error('Downloaded URL did not contain an image.');
      }
      throw new Error(`Unexpected text response: ${rawText.slice(0, 180)}`);
    }

    const { maybeBase64, maybeUrl, error } = extractImageDataFromJson(data);

    if (typeof maybeBase64 === 'string' && maybeBase64.length > 0) {
      const blob = base64ToBlob(maybeBase64);
      if (await isLikelyImageBlob(blob)) return blob;
      throw new Error('Base64 payload was not a valid image.');
    }

    if (typeof maybeUrl === 'string' && maybeUrl.startsWith('http')) {
      const imageResponse = await fetch(maybeUrl);
      if (!imageResponse.ok) {
        throw new Error('Model returned an image URL, but download failed.');
      }
      const blob = await imageResponse.blob();
      if (await isLikelyImageBlob(blob)) return blob;
      throw new Error('Downloaded URL did not contain an image.');
    }

    if (error) {
      throw new Error(error);
    }

    throw new Error(`Unexpected JSON response: ${JSON.stringify(data).slice(0, 220)}`);
  }

  const fallbackBlob = await response.blob();
  if (await isLikelyImageBlob(fallbackBlob)) return fallbackBlob;

  throw new Error(`Unsupported response content-type: ${contentType || 'unknown'}`);
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
