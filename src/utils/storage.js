const LOCAL_STORAGE_KEY = 'oilcanvas:history:v1';
const DB_NAME = 'oilcanvas-db';
const DB_VERSION = 1;
const STORE_NAME = 'artworks';
const MAX_ARTWORKS = 12;

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putImageBlob(id, blob) {
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ id, blob });
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function getImageBlob(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => resolve(req.result?.blob ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function deleteImageBlob(id) {
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

function readMetaList() {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeMetaList(list) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
}

function toTitle(prompt) {
  const clean = prompt.trim().replace(/\s+/g, ' ');
  return clean.length > 48 ? `${clean.slice(0, 48)}...` : clean;
}

export async function saveArtwork({ prompt, blob }) {
  const id = crypto.randomUUID();
  await putImageBlob(id, blob);

  const list = readMetaList();
  const entry = {
    id,
    prompt,
    title: toTitle(prompt),
    createdAt: new Date().toISOString()
  };

  const next = [entry, ...list].slice(0, MAX_ARTWORKS);
  const removed = list.slice(MAX_ARTWORKS - 1);
  writeMetaList(next);

  await Promise.all(removed.map((item) => deleteImageBlob(item.id).catch(() => null)));

  return entry;
}

export async function loadHistory() {
  const list = readMetaList();
  const withUrls = await Promise.all(
    list.map(async (item) => {
      const blob = await getImageBlob(item.id);
      const imageUrl = blob ? URL.createObjectURL(blob) : null;
      return { ...item, imageUrl };
    })
  );

  return withUrls.filter((item) => item.imageUrl);
}

export async function getArtworkBlob(id) {
  return getImageBlob(id);
}

export function releaseHistoryUrls(items) {
  items.forEach((item) => {
    if (item.imageUrl) URL.revokeObjectURL(item.imageUrl);
  });
}
