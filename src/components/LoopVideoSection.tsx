'use client';

interface LoopVideoSectionProps {
  videoUrl: string;
  posterUrl: string;
  title?: string;
  description?: string;
  overlay?: boolean;
}

export default function LoopVideoSection({ 
  videoUrl, 
  posterUrl, 
  title, 
  description,
  overlay = true 
}: LoopVideoSectionProps) {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={posterUrl}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {overlay && (
        <div className="absolute inset-0 bg-black/40" />
      )}

      {(title || description) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            {title && (
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}