import React, { useState } from 'react';
import { RotateCw, Sparkles, CheckCircle2, Shield, Eye } from 'lucide-react';

const SHOWCASE_ANGLES = [
  { angle: '0° Front View', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', label: 'Dial & Bezel Perfection' },
  { angle: '90° Side Profile', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80', label: 'Case Thickness & Crown' },
  { angle: '180° Back Case', image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80', label: 'Exhibition Caseback' },
  { angle: '270° Clasp & Bracelet', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80', label: 'Solid End Links & Engravings' },
];

export const MediaShowcaseSection: React.FC = () => {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);

  return (
    <section id="media-showcase-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-900">
      <div className="rounded-3xl bg-neutral-950 border border-neutral-800 p-6 sm:p-10 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Info Side */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-950/80 text-red-500 border border-red-800/60 font-mono-code">
              <RotateCw className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} />
              360° PRECISION INSPECTION
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase font-display">
              MASTER WORKMANSHIP <span className="text-red-600">INSPECTION LAB</span>
            </h2>

            <p className="text-sm text-neutral-300 leading-relaxed">
              Every production batch undergoes high-resolution optical verification. Inspect our luxury timepiece case geometry, weight alignment, and surface micro-brushing from multiple dynamic angles.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs">
                <div className="text-red-500 font-bold font-mono-code mb-1">904L / 316L STEEL</div>
                <div className="text-neutral-400 text-[11px]">Solid high-density corrosion-proof case forging.</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs">
                <div className="text-red-500 font-bold font-mono-code mb-1">SAPPHIRE CRYSTAL</div>
                <div className="text-neutral-400 text-[11px]">Anti-reflective cyclops magnification with laser crown.</div>
              </div>
            </div>

            {/* Interactive Angle Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {SHOWCASE_ANGLES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveAngleIndex(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold uppercase transition-all flex items-center gap-1.5 ${
                    activeAngleIndex === idx
                      ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  <span>{item.angle}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Viewer Side */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-md rounded-2xl bg-black border border-neutral-800 p-6 flex flex-col items-center justify-center red-glow group">
              <img
                src={SHOWCASE_ANGLES[activeAngleIndex].image}
                alt="Product 360 view"
                className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-all duration-500"
              />

              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-white font-mono-code font-bold">
                  {SHOWCASE_ANGLES[activeAngleIndex].label}
                </span>
                <span className="text-red-400 font-mono-code text-[11px]">
                  {SHOWCASE_ANGLES[activeAngleIndex].angle}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
