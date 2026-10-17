'use client';

import { Shirt } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-bold mb-8 text-gray-900">RECENT COLLECTIONS</h3>
        <p className="text-gray-600 mb-8">The latest drops and curated collections from across the site.</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer group border border-gray-200"
          >
            <div className={`h-40 bg-gradient-to-b ${item.color} flex items-center justify-center relative`}>
              <Shirt size={48} className="text-white opacity-80" />
              {item.discount && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                  className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold"
                >
                  {item.discount}
                </motion.span>
              )}
            </div>
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}