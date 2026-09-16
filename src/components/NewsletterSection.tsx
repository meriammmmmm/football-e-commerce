'use client';

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle newsletter signup here
    console.log('Newsletter signup:', email);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
    }, 1000);
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#0f1726] p-8 sm:p-12 lg:p-16">
          {/* Subtle dot pattern background */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
                BARCELONA TERRACE SOCIETY
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                JOIN THE HEADBUTT CLUB
              </h2>
              
              <p className="text-gray-400 leading-relaxed">
                Receive private release windows for archived vintage grails, secret European deadstock kit drops, and invitations to underground cage pop-ups across Barcelona.
              </p>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col items-start lg:items-end">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-5 py-3.5 rounded-xl bg-[#0a1628] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 transition-all text-sm"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-3.5 rounded-xl bg-emerald-500 text-gray-950 font-bold uppercase text-sm tracking-wide transition-all hover:bg-emerald-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap sm:w-auto"
                  >
                    {isSubmitting ? 'JOINING...' : 'JOIN DROP LIST'}
                  </button>
                </div>
                <p className="mt-3 text-xs text-gray-500 text-center">
                  No spam. Only authentic drops and matchday culture.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
