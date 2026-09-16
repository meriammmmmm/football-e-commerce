import Image from 'next/image';
import { MapPin } from 'lucide-react';

const MAPS_URL = 'https://www.google.com/maps/place/Headbutt+Barcelona+Vintage+Football+Store/@41.3812711,2.1748955,17z/data=!4m17!1m8!3m7!1s0x12a4a3cc4350d87b:0x438cad57a0ffff8e!2sHeadbutt+Barcelona+Vintage+Football+Store!8m2!3d41.3812711!4d2.1748955!10e1!16s%2Fg%2F11npqm4k_0!3m7!1s0x12a4a3cc4350d87b:0x438cad57a0ffff8e!8m2!3d41.3812711!4d2.1748955!9m1!1b1!16s%2Fg%2F11npqm4k_0!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-10 overflow-hidden rounded bg-emerald-600">
                <Image src="/headbutt-logo.jpg" alt="Headbutt Barcelona" fill sizes="40px" className="object-cover" />
              </div>
              <span className="text-lg font-bold text-white">HEADBUTT</span>
            </div>
            <p className="text-gray-400 text-sm">The world&apos;s leading destination for classic and vintage football shirts.</p>
            <a href={MAPS_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300">
              <MapPin size={16} /> Visit us in Barcelona
            </a>
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
          <div>
            <h4 className="font-bold mb-4 text-sm text-white">ABOUT</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Press</a></li>
              <li><a href="#" className="hover:text-white transition">Sustainability</a></li>
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
