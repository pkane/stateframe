'use client'

import { motion } from 'framer-motion'
import { componentRegistry } from '@/lib/registry'
import { ENTRANCE_EASING } from '@/lib/constants'
import { Breadcrumb } from './Breadcrumb'
import { ComponentCell } from './ComponentCell'

export function Canvas() {
  return (
    <div className="relative h-full w-full overflow-auto bg-[#fafafa]">
      <Breadcrumb />

      {/* Overview grid */}
      <main
        className="mx-auto max-w-5xl px-10 pt-24 pb-20"
        role="main"
        aria-label="Component overview"
      >
        <div className="flex flex-col gap-16">
          {componentRegistry.map((group, groupIndex) => (
            <section key={group.id} aria-labelledby={`group-${group.id}`}>
              <motion.h2
                id={`group-${group.id}`}
                className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-neutral-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: ENTRANCE_EASING }}
              >
                {group.label}
              </motion.h2>

              <div className="flex flex-wrap gap-4">
                {group.variants.map((variant, variantIndex) => (
                  <motion.div
                    key={variant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      ease: ENTRANCE_EASING,
                      delay: 0.5 + groupIndex * 0.3 + variantIndex * 0.15,
                    }}
                  >
                    <ComponentCell variant={variant} />
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
