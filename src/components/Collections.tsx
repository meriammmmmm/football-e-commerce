import { Shirt } from 'lucide-react';

interface Collection {
  title: string;
  description: string;
  color: string;
  discount?: string;
}

interface CollectionsProps {
  collections: Collection[];
}

export default function Collections({ collections }: CollectionsProps) {
  return (
    <section className="container mx-auto px-6 py-12">
      <h3 className="text-2xl font-bold mb-8 text-gray-900">RECENT COLLECTIONS</h3>
      <p className="text-gray-600 mb-8">The latest drops and curated collections from across the site.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((item, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer group border border-gray-200">
            <div className={`h-40 bg-gradient-to-b ${item.color} flex items-center justify-center relative`}>
              <Shirt size={48} className="text-white opacity-80" />
              {item.discount && (
                <span className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">{item.discount}</span>
              )}
            </div>
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}