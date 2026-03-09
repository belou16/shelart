import { motion } from 'framer-motion';

const EXAMPLES = [
  'Moonlit vineyard on rolling hills with cinematic clouds',
  'Old harbor at sunrise with golden reflections and boats',
  'Portrait of a violinist under dramatic stage lighting'
];

export function ExampleStrip({ onUse }) {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {EXAMPLES.map((item, idx) => (
        <motion.button
          key={item}
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: idx * 0.1 }}
          onClick={() => onUse(item)}
          className="rounded-2xl border border-gold/10 bg-black/30 px-5 py-4 text-left text-sm text-pearl/85 transition hover:scale-[1.01] hover:border-gold/40 hover:bg-black/50"
        >
          {item}
        </motion.button>
      ))}
    </div>
  );
}
