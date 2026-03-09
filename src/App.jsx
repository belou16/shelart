import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { HeroInput } from './components/HeroInput';
import { ExampleStrip } from './components/ExampleStrip';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ArtworkStage } from './components/ArtworkStage';
import { GalleryPanel } from './components/GalleryPanel';
import { generateOilPainting } from './utils/huggingface';
import {
  getArtworkBlob,
  loadHistory,
  releaseHistoryUrls,
  saveArtwork
} from './utils/storage';

function App() {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [shownCount, setShownCount] = useState(6);

  useEffect(() => {
    let mounted = true;
    loadHistory().then((items) => {
      if (!mounted) return;
      setHistory(items);
      if (items[0]) setActiveId(items[0].id);
    });

    return () => {
      mounted = false;
      releaseHistoryUrls(history);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 220;
      if (nearBottom) setShownCount((prev) => Math.min(prev + 3, 12));
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeArtwork = useMemo(
    () => history.find((item) => item.id === activeId) || null,
    [history, activeId]
  );

  async function handleGenerate(event) {
    event.preventDefault();
    setError('');
    setIsGenerating(true);

    try {
      const blob = await generateOilPainting(prompt);
      const entry = await saveArtwork({ prompt, blob });
      const imageUrl = URL.createObjectURL(blob);
      const next = [{ ...entry, imageUrl }, ...history].slice(0, 12);
      setHistory((prev) => {
        const merged = [{ ...entry, imageUrl }, ...prev].slice(0, 12);
        return merged;
      });
      setActiveId(entry.id);
      setShownCount((prev) => Math.max(prev, Math.min(next.length, 9)));
      setPrompt('');
    } catch (err) {
      setError(err.message || 'Failed to generate artwork.');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDownload() {
    if (!activeId) return;
    const blob = await getArtworkBlob(activeId);
    if (!blob) return;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `oilcanvas-${activeId}.png`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function selectByOffset(direction) {
    if (!history.length || !activeId) return;
    const index = history.findIndex((item) => item.id === activeId);
    if (index < 0) return;

    if (direction === 'next' && index < history.length - 1) {
      setActiveId(history[index + 1].id);
    }

    if (direction === 'prev' && index > 0) {
      setActiveId(history[index - 1].id);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-obsidian to-abyss text-pearl">
      <main className="mx-auto w-full max-w-7xl p-8 lg:p-12">
        <section className="flex min-h-screen items-center justify-center">
          <div className="w-full">
            <HeroInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleGenerate}
              disabled={isGenerating}
            />
            <ExampleStrip onUse={setPrompt} />
            {error && (
              <p className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            )}
          </div>
        </section>

        <div className="space-y-8">
          {isGenerating && <LoadingSkeleton />}

          {activeArtwork && !isGenerating && (
            <ArtworkStage
              artwork={activeArtwork}
              onDownload={handleDownload}
              onGenerateNew={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              onOpenGallery={() =>
                document
                  .getElementById('gallery-section')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              onSwipeNavigate={selectByOffset}
            />
          )}

          <motion.div
            id="gallery-section"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
          >
            <GalleryPanel
              items={history}
              selectedId={activeId}
              onSelect={setActiveId}
              search={search}
              onSearch={setSearch}
              shownCount={shownCount}
              onLoadMore={() => setShownCount((prev) => Math.min(prev + 3, 12))}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default App;
