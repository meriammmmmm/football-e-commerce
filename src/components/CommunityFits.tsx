'use client';

import { Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface CommunityFit {
  id: string;
  username: string;
  location: string;
  image_url: string;
  likes: string;
  product_name: string;
  price: string;
  tag: string;
  cta_text: string;
  cta_type: 'shop' | 'view' | 'get_kit';
  stock_status?: string;
}

export default function CommunityFits() {
  const [activeFilter, setActiveFilter] = useState('ALL FITS');
  const fits: CommunityFit[] = [
    {
      id: '1',
      username: '@headbutt.bcn',
      location: 'BCN',
      image_url: '/756436518_18103895371999396_4894283240947071173_n.jpg',
      likes: '1.2k',
      product_name: 'Argentina & Boca Retro Squad',
      price: 'From €95.99',
      tag: 'TAGGED FIT',
      cta_text: 'SHOP',
      cta_type: 'shop',
      stock_status: 'In Stock'
    },
    {
      id: '2',
      username: '@headbutt.bcn',
      location: 'BCN',
      image_url: '/757954847_18103895350999396_5983842247708972129_n.jpg',
      likes: '2.8k',
      product_name: "Brazil Ronaldo #9 Long Sleeve",
      price: '€189.99',
      tag: 'STREET STYLE',
      cta_text: 'SHOP',
      cta_type: 'shop'
    },
    {
      id: '3',
      username: '@headbutt.bcn',
      location: 'BCN',
      image_url: '/756857788_18103895326999396_4513381999901559894_n.jpg',
      likes: '3.5k',
      product_name: 'AC Milan bwin Era',
      price: '€98.99',
      tag: 'FABRIC DETAIL',
      cta_text: 'VIEW',
      cta_type: 'view'
    },
    {
      id: '4',
      username: '@headbutt.bcn',
      location: 'BCN',
      image_url: '/756833144_18103895335999396_8990120619776430882_n.jpg',
      likes: '4.2k',
      product_name: 'Brazil & Milan Double Fit',
      price: 'From €98.99',
      tag: 'DOUBLE FIT DROP',
      cta_text: 'SHOP PAIR',
      cta_type: 'shop'
    },
    {
      id: '5',
      username: '@headbutt.bcn',
      location: 'BCN',
      image_url: '/758006664_18103895362999396_7962434200034526890_n.jpg',
      likes: '2.1k',
      product_name: 'Argentina 94 Retro #10',
      price: '€99.99',
      tag: 'BARCELONA STREETS',
      cta_text: 'SHOP',
      cta_type: 'shop'
    }
  ];

  return (
    <section className="bg-[#0a1628] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-400 mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            CURATED ON THE STREETS OF EL RAVAL & GÒTIC
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            COMMUNITY FITS
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl">
            Real supporters. Real matchday and street style across the city. Tag{' '}
            <span className="text-emerald-400 font-semibold">@headbutt.bcn</span> or{' '}
            <span className="text-emerald-400 font-semibold">#HeadbuttFits</span> on Instagram to be featured on our grid.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {['ALL FITS', 'MATCH DAY', 'STREETWEAR', 'RETRO CLASSICS', 'NATIONAL'].map((tab, idx) => (
            <motion.button
              key={tab}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 + idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(tab)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === activeFilter
                  ? 'bg-emerald-500 text-gray-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {fits.filter((fit) => activeFilter === 'ALL FITS' || fit.tag.includes(activeFilter.replace(' ', '')) || (activeFilter === 'NATIONAL' && fit.product_name.includes('Argentina'))).length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="col-span-full flex flex-col items-center justify-center py-20 px-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6 rounded-full bg-white/5 p-8 backdrop-blur-sm border border-white/10"
              >
                <ShoppingBag size={48} className="text-emerald-400" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-2"
              >
                No fits found
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 text-center max-w-md mb-6"
              >
                No community fits match this filter. Check out other categories or tag us on Instagram!
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter('ALL FITS')}
                className="px-6 py-3 rounded-full bg-emerald-500 text-gray-950 font-semibold hover:bg-emerald-400 transition-colors"
              >
                View All Fits
              </motion.button>
            </motion.div>
          ) : (
            fits.filter((fit) => activeFilter === 'ALL FITS' || fit.tag.includes(activeFilter.replace(' ', '')) || (activeFilter === 'NATIONAL' && fit.product_name.includes('Argentina'))).map((fit, index) => (
              <motion.div
                key={fit.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ scale: 1.03, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  src={fit.image_url}
                  alt={fit.product_name}
                  className="h-full w-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />

                {/* User Info - Top */}
                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white">
                    {fit.username}
                  </span>
                  {fit.location && (
                    <>
                      <span className="text-white/40">·</span>
                      <span className="text-xs text-white/70">{fit.location}</span>
                    </>
                  )}
                </div>

                {/* Likes - Top Right */}
                <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10">
                  <Heart size={12} className="fill-red-500 text-red-500" />
                  <span className="text-xs font-semibold text-white">{fit.likes}</span>
                </div>

                {/* Content - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                      {fit.tag}
                    </div>
                    <h3 className="text-base font-bold text-white mb-1 leading-tight">
                      {fit.product_name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-300 font-medium">
                        {fit.price}
                      </span>
                      {fit.stock_status && (
                        <>
                          <span className="text-white/30">·</span>
                          <span className="text-xs text-emerald-400">{fit.stock_status}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-all ${
                      fit.cta_type === 'get_kit'
                        ? 'bg-emerald-500 text-gray-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50'
                        : fit.cta_type === 'view'
                        ? 'border border-white/30 bg-transparent text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50'
                        : 'bg-emerald-500 text-gray-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50'
                    }`}
                  >
                    {fit.cta_type === 'get_kit' && <ShoppingBag size={14} />}
                    {fit.cta_text}
                    {fit.cta_type === 'view' && <span className="ml-1">→</span>}
                    {fit.cta_type === 'shop' && <span className="ml-1">→</span>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
          )}
        </motion.div>
      </div>
    </section>
  );
}
