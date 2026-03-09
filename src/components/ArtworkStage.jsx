import { Download, ImagePlus, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

export function ArtworkStage({
  artwork,
  onDownload,
  onGenerateNew,
  onOpenGallery,
  onSwipeNavigate
}) {
  if (!artwork?.imageUrl) return null;

  return (
    <motion.section
      key={artwork.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl border border-gold/10 bg-black/40"
    >
      <div className="absolute left-4 top-4 z-20 rounded-xl bg-black/65 px-3 py-1.5 text-xs text-pearl/75 backdrop-blur">
        Pinch/scroll to zoom, drag to pan
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.25}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) onSwipeNavigate('next');
          if (info.offset.x > 80) onSwipeNavigate('prev');
        }}
      >
        <TransformWrapper centerOnInit minScale={0.8} initialScale={1} maxScale={5}>
          <TransformComponent
            wrapperStyle={{ width: '100%', maxHeight: '80vh' }}
            contentStyle={{ width: '100%' }}
          >
            <img
              src={artwork.imageUrl}
              alt={artwork.prompt}
              className="mx-auto h-auto w-full object-contain"
            />
          </TransformComponent>
        </TransformWrapper>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5">
        <p className="mb-4 max-w-4xl text-sm text-pearl/85 md:text-base">{artwork.prompt}</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gold-hover"
          >
            <Download className="h-4 w-4" />
            Download HD
          </button>
          <button
            type="button"
            onClick={onGenerateNew}
            className="inline-flex items-center gap-2 rounded-xl border border-gold/20 bg-black/65 px-4 py-2.5 text-sm font-medium text-pearl transition hover:border-gold/40"
          >
            <ImagePlus className="h-4 w-4" />
            New Artwork
          </button>
          <button
            type="button"
            onClick={onOpenGallery}
            className="inline-flex items-center gap-2 rounded-xl border border-gold/20 bg-black/65 px-4 py-2.5 text-sm font-medium text-pearl transition hover:border-gold/40"
          >
            <Search className="h-4 w-4" />
            Gallery
          </button>
        </div>
      </div>
    </motion.section>
  );
}
