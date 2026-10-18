import Image from 'next/image';
import { MapPin } from 'lucide-react';

const MAPS_URL = 'https://www.google.com/maps/place/Headbutt+Barcelona+Vintage+Football+Store/@41.3812711,2.1748955,17z/data=!4m17!1m8!3m7!1s0x12a4a3cc4350d87b:0x438cad57a0ffff8e!2sHeadbutt+Barcelona+Vintage+Football+Store!8m2!3d41.3812711!4d2.1748955!10e1!16s%2Fg%2F11npqm4k_0!3m7!1s0x12a4a3cc4350d87b:0x438cad57a0ffff8e!8m2!3d41.3812711!4d2.1748955!9m1!1b1!16s%2Fg%2F11npqm4k_0!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="container mx-auto px-6">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3 relative">
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden text-[clamp(4rem,16vw,14rem)] font-black leading-[0.72] tracking-[-0.1em] text-white/[0.04] select-none pointer-events-none whitespace-nowrap">HEADBUTT</div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-10 overflow-hidden rounded bg-emerald-600">
                <Image src="/headbutt-logo.jpg" alt="Headbutt Barcelona" fill sizes="40px" className="object-cover" />
              </div>
              <span className="text-lg font-bold text-white">HEADBUTT</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">The world&apos;s leading destination for classic and vintage football shirts.</p>
            <div className="flex flex-col gap-2">
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition-all hover:text-emerald-300 hover:gap-3">
                <MapPin size={16} /> Visit us in Barcelona
              </a>
              <a 
                href="https://www.instagram.com/headbuttbarcelona/" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition-all hover:text-emerald-300 hover:gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                @headbuttbarcelona
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm text-white">SHOP</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">New In</a></li>
              <li><a href="#" className="hover:text-white transition">Classic</a></li>
              <li><a href="#" className="hover:text-white transition">Legends</a></li>
              <li><a href="#" className="hover:text-white transition">Clearance</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm text-white">HELP</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition">Returns</a></li>
              <li><a href="#" className="hover:text-white transition">Size Guide</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© 2026 Headbutt Barcelona. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
