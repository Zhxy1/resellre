import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, Trash2, ArrowRight, Eye, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FavoritesDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, products, toggleFavorite, openProductModal, openRequestModal } = useStore();

  if (!isOpen) return null;

  const favoriteProducts = products.filter((p) => currentUser.favorites.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        id="favorites-drawer"
        className="w-full max-w-md bg-neutral-950 border-l border-neutral-800 h-full flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h3 className="font-bold text-white uppercase text-base tracking-wide">
              Saved Products ({favoriteProducts.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-12 h-12 text-neutral-800 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white uppercase">No Saved Items</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Click the heart icon on any product in the catalog to curate your wholesale manifest.
              </p>
            </div>
          ) : (
            favoriteProducts.map((prod) => {
              const tier10 = prod.wholesaleTiers && prod.wholesaleTiers[10] ? prod.wholesaleTiers[10] / 10 : (prod.baseUnitPrice ?? 0);

              return (
                <div
                  key={prod.id}
                  className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3 justify-between"
                >
                  <div
                    onClick={() => {
                      onClose();
                      openProductModal(prod);
                    }}
                    className="w-16 h-16 rounded-xl bg-black border border-neutral-800 p-1 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono-code text-red-500 uppercase font-bold">
                      {prod.category}
                    </span>
                    <h4
                      onClick={() => {
                        onClose();
                        openProductModal(prod);
                      }}
                      className="text-xs font-bold text-white truncate cursor-pointer hover:text-red-400"
                    >
                      {prod.name}
                    </h4>
                    <span className="text-xs font-mono-code text-neutral-300 block mt-0.5">
                      ${tier10.toFixed(2)}/unit (10u tier)
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        openRequestModal(prod, 10);
                      }}
                      className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                      title="Request 10 Units"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleFavorite(prod.id)}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-red-500"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};
