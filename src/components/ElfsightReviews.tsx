'use client';

import Script from 'next/script';

export default function ElfsightReviews() {
  return (
    <section className="bg-[#060b16] py-14 sm:py-20" aria-label="Google customer reviews">
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="afterInteractive"
      />
      <div
        className="elfsight-app-82ad9ee3-2d5d-4bfd-8963-bde2acaebde0"
        data-elfsight-app-lazy
      />
    </section>
  );
}
