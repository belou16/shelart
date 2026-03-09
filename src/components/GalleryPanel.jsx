import { motion } from 'framer-motion';

export function GalleryPanel({
  items,
  selectedId,
  onSelect,
  search,
  onSearch,
  shownCount,
  onLoadMore
}) {
  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.prompt.toLowerCase().includes(search.toLowerCase())
  );

  const visible = filtered.slice(0, shownCount);

  return (
    <section className="rounded-3xl border border-gold/10 bg-card p-4 backdrop-blur-xl md:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold md:text-4xl">Gallery</h2>
        <span className="text-sm text-pearl/60">Last {items.length} creations</span>
      </div>

      <input
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Search by title"
        className="mb-5 h-12 w-full rounded-xl border border-gold/10 bg-black/50 px-4 text-sm outline-none focus:border-gold/50"
      />

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {visible.map((item, idx) => (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02, duration: 0.25 }}
            onClick={() => onSelect(item.id)}
            className={`mb-4 w-full overflow-hidden rounded-2xl border bg-black/40 text-left transition hover:scale-[1.01] ${
              selectedId === item.id ? 'border-gold/60' : 'border-gold/10'
            }`}
          >
            <img src={item.imageUrl} alt={item.title} className="h-auto w-full object-cover" />
            <div className="p-3">
              <p className="text-sm font-semibold text-pearl">{item.title}</p>
              <p className="mt-1 text-xs text-pearl/60">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {shownCount < filtered.length && (
        <button
          type="button"
          onClick={onLoadMore}
          className="mt-4 rounded-xl border border-gold/25 px-4 py-2 text-sm text-pearl transition hover:border-gold/55"
        >
          Load more
        </button>
      )}
    </section>
  );
}
