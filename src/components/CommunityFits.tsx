'use client';

import { Heart, ShoppingBag, Eye } from 'lucide-react';

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
  const fits: CommunityFit[] = [
    {
      id: '1',
      username: '@headbutt.bcn',
      location: 'BCN',
      image_url: '/080B6C0F-BF0C-4050-A339-FD6CD3FB37A7.JPG',
      likes: '1.2k',
      product_name: 'Real Madrid Zidane #5',
      price: '€99.99',
      tag: 'TAGGED FIT',
      cta_text: 'SHOP',
      cta_type: 'shop',
      stock_status: 'In Stock'
    },
    {
      id: '2',
      username: '@headbutt.bcn',
      location: 'BCN',
      image_url: '/0DB5904D-372D-4D8E-A2F9-3BFF07454CA6.JPG',
      likes: '2.8k',
      product_name: "Brazil Rivaldo #10",
      price: '€189.99',
      tag: 'LONG SLEEVE ICON',
      cta_text: 'SHOP',
      cta_type: 'shop'
    },
    {
      id: '3',
      username: '@headbutt.bcn',
      location: 'BCN',
      image_url: '/65CF9DBA-07AA-483A-9C96-58761782AE26.JPG',
      likes: '3.5k',
      product_name: 'Netherlands Bergkamp #8',
      price: '€195.99',
      tag: 'DUTCH LEGEND',
      cta_text: 'GET KIT',
      cta_type: 'get_kit'
    },
    {
      id: '4',
      username: '@headbutt.bcn',
      location: 'BCN',
      image_url: '/E657EAF0-0C57-49B9-B4A8-B63BD9B21930.JPG',
      likes: '4.2k',
      product_name: 'Man United Champions League 1999',
      price: '€99.99',
      tag: 'HISTORIC FINAL',
      cta_text: 'SHOP',
      cta_type: 'shop'
    },
    {
      id: '5',
      username: '@headbutt.bcn',
      location: 'BCN',
      image_url: '/AFFE99A3-9EED-4E8E-B6A2-C6117759DBA5.JPG',
      likes: '2.1k',
      product_name: 'Man United Van Nistelrooy #10',
      price: '€98.99',
      tag: 'RETRO CLASSIC',
      cta_text: 'VIEW',
      cta_type: 'view'
    }
  ];

  return (
    <section className="bg-[#0a1628] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
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
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['ALL FITS', 'MATCH DAY', 'STREETWEAR', 'RETRO CLASSICS', 'NATIONAL'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === 'ALL FITS'
                  ? 'bg-emerald-500 text-gray-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fits.map((fit) => (
            <div
              key={fit.id}
              className="group relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-emerald-500/30"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={fit.image_url}
                  alt={fit.product_name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                  <button
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-all ${
                      fit.cta_type === 'get_kit'
                        ? 'bg-emerald-500 text-gray-950 hover:bg-emerald-400'
                        : fit.cta_type === 'view'
                        ? 'border border-white/30 bg-transparent text-emerald-400 hover:bg-emerald-500/10'
                        : 'bg-emerald-500 text-gray-950 hover:bg-emerald-400'
                    }`}
                  >
                    {fit.cta_type === 'get_kit' && <ShoppingBag size={14} />}
                    {fit.cta_text}
                    {fit.cta_type === 'view' && <span className="ml-1">→</span>}
                    {fit.cta_type === 'shop' && <span className="ml-1">→</span>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
