'use client';

import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import type { CartItem } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, items, onClose, onUpdateQuantity, onRemove, onCheckout }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70]" aria-hidden={!isOpen}>
          {/* Backdrop */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            type="button"
            onClick={onClose}
            aria-label="Close cart overlay"
            className="absolute inset-0 bg-[#020611]/65 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[450px] flex-col bg-[#f4f0e7] text-[#11192d] shadow-2xl sm:max-w-[560px]"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex items-center justify-between border-b border-[#11192d]/10 px-4 py-5 sm:px-6 sm:py-7"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <h2 className="text-2xl font-black tracking-[-0.05em] sm:text-4xl">Cart</h2>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="grid h-8 min-w-8 place-items-center rounded-full bg-[#11192d]/10 px-2 text-sm font-bold sm:h-10 sm:min-w-10 sm:text-lg"
                >
                  {itemCount}
                </motion.span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="grid h-10 w-10 place-items-center rounded-full border border-[#11192d]/10 text-[#11192d] transition hover:bg-emerald-400 sm:h-12 sm:w-12"
              >
                <X size={24} className="sm:w-[27px] sm:h-[27px]" />
              </motion.button>
            </motion.div>
            {/* Cart Items or Empty State */}
            {items.length ? (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-7">
                  {items.map((item, index) => (
                    <motion.article
                      key={`${item.product.id}-${item.size}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="mb-6 flex gap-3 border-b border-[#11192d]/10 pb-6 last:mb-0 sm:gap-4"
                    >
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        src={item.product.hover_image_url ?? item.product.image_url}
                        alt={item.product.name}
                        className="h-24 w-20 shrink-0 rounded-lg object-cover sm:h-28 sm:w-24"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex gap-2 sm:gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-black uppercase leading-tight sm:text-lg">
                              {item.product.name}
                            </h3>
                            <p className="mt-1 text-xs font-bold uppercase text-[#11192d]/70 sm:text-sm">
                              {item.product.team} · {item.size}
                            </p>
                          </div>
                          <span className="whitespace-nowrap text-base font-black sm:text-lg">
                            €{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center gap-3 sm:mt-5 sm:gap-5">
                          <div className="flex items-center rounded-lg border border-[#11192d]/15 bg-white">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                              disabled={item.quantity === 1}
                              className="grid h-9 w-9 place-items-center text-[#11192d]/60 disabled:opacity-30 sm:h-10 sm:w-10"
                            >
                              <Minus size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </motion.button>
                            <span className="grid h-9 min-w-9 place-items-center text-sm font-bold sm:h-10 sm:min-w-10 sm:text-base">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                              className="grid h-9 w-9 place-items-center sm:h-10 sm:w-10"
                            >
                              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </motion.button>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => onRemove(index)}
                            aria-label={`Remove ${item.product.name}`}
                            className="text-[#11192d] transition hover:text-red-600"
                          >
                            <Trash2 size={19} className="sm:w-[21px] sm:h-[21px]" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
                
                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="border-t border-[#11192d]/15 px-4 py-5 sm:px-6 sm:py-6"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between border-b border-[#11192d]/15 py-3 text-left text-base font-black sm:py-4 sm:text-lg"
                  >
                    <span>Discount</span>
                    <Plus size={20} className="sm:w-[22px] sm:h-[22px]" />
                  </button>
                  <div className="flex items-center justify-between pt-5 text-lg font-black sm:pt-6 sm:text-xl">
                    <span>Estimated total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-[#11192d]/70 sm:mt-4 sm:text-sm">
                    Duties and taxes included. Shipping is calculated at checkout.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onCheckout}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#11192d] py-4 text-lg font-black text-white transition hover:bg-emerald-600 sm:mt-6 sm:py-5 sm:text-xl"
                  >
                    <ShoppingBag size={18} className="sm:w-[20px] sm:h-[20px]" /> Check out
                  </motion.button>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center sm:px-8"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="grid h-14 w-14 place-items-center rounded-full bg-emerald-400/20 text-emerald-700 sm:h-16 sm:w-16"
                >
                  <ShoppingBag size={26} className="sm:w-[28px] sm:h-[28px]" />
                </motion.span>
                <h3 className="text-xl font-black sm:text-2xl">Your cart is empty</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-[#11192d] px-6 py-3 text-sm font-bold text-white sm:text-base"
                >
                  Keep shopping
                </motion.button>
              </motion.div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
