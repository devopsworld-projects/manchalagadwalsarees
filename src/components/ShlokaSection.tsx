import { motion } from 'framer-motion';

/**
 * A devotional shloka band — evokes the spiritual roots of saree weaving
 * (Goddess Lakshmi & the loom). Sits between sections as a meditative pause.
 */
export function ShlokaSection() {
  return (
    <section className="relative py-20 md:py-28 bg-cream overflow-hidden mandala-bg">
      {/* Top + bottom gopuram bands */}
      <div className="gopuram-band-inverted absolute top-0 left-0 right-0 opacity-70" />
      <div className="gopuram-band absolute bottom-0 left-0 right-0 opacity-70" />

      {/* Rotating mandala backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[520px] h-[520px] opacity-[0.07] animate-slow-spin"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><g fill='none' stroke='%237A1F2B' stroke-width='0.6'><circle cx='100' cy='100' r='90'/><circle cx='100' cy='100' r='70'/><circle cx='100' cy='100' r='50'/><circle cx='100' cy='100' r='30'/><g><path d='M100 10 L100 190 M10 100 L190 100 M30 30 L170 170 M170 30 L30 170'/></g><g><circle cx='100' cy='30' r='6'/><circle cx='170' cy='100' r='6'/><circle cx='100' cy='170' r='6'/><circle cx='30' cy='100' r='6'/></g></g></svg>\")",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.9 }}
        className="relative container max-w-3xl text-center"
      >
        <div className="lotus-divider mb-8">
          <span className="lotus" />
        </div>

        <p className="devanagari text-2xl md:text-4xl text-primary leading-relaxed mb-6">
          वस्त्रं देवीस्वरूपं — साक्षाद् लक्ष्म्याः प्रसादः
        </p>

        <p className="font-serif italic text-base md:text-lg text-foreground/70 leading-relaxed">
          "A garment is the form of the Goddess herself —
          <br className="hidden sm:block" />
          the very grace of Lakshmi, woven thread by thread."
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="w-12 h-[1px] bg-accent/40" />
          <span className="text-accent text-[10px] tracking-[0.5em] uppercase font-display">
            ◆&nbsp; Heritage of the Loom &nbsp;◆
          </span>
          <div className="w-12 h-[1px] bg-accent/40" />
        </div>
      </motion.div>
    </section>
  );
}
