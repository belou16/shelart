import { motion } from 'framer-motion';

export function LoadingSkeleton() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-gold/10 bg-card p-4 backdrop-blur-xl md:p-6">
      <div className="animate-pulse rounded-2xl bg-white/5" style={{ paddingTop: '62%' }} />
      <div className="mt-5 h-6 w-56 animate-pulse rounded-lg bg-white/10" />
      <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded-lg bg-white/5" />
      <motion.div
        className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-gold/15 to-transparent"
        animate={{ x: ['0%', '330%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
      <p className="mt-4 text-sm text-pearl/70">AI is painting your masterpiece...</p>
    </section>
  );
}
