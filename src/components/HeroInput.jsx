import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroInput({ value, onChange, onSubmit, disabled }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl rounded-3xl border border-gold/10 bg-card p-6 shadow-glow backdrop-blur-xl md:p-10"
    >
      <h1 className="text-center text-5xl font-bold tracking-tight text-pearl md:text-7xl">
        OilCanvas
      </h1>
      <p className="mt-4 text-center text-lg font-medium text-pearl/80 md:text-xl">
        Your words. Masterpiece canvas.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4 md:flex-row">
        <label htmlFor="prompt" className="sr-only">
          Describe your painting
        </label>
        <input
          id="prompt"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Describe your painting"
          className="h-14 flex-1 rounded-2xl border border-gold/10 bg-black/50 px-5 text-base font-medium text-pearl outline-none transition focus:border-gold/50 focus:shadow-glow"
          maxLength={280}
          disabled={disabled}
          required
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gold px-7 text-base font-semibold text-black transition hover:scale-[1.02] hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Sparkles className="h-5 w-5" />
          Generate
        </button>
      </form>
    </motion.section>
  );
}
