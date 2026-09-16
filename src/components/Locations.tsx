interface LocationsProps {
  cities: string[];
}

export default function Locations({ cities }: LocationsProps) {
  return (
    <section className="container mx-auto px-6 py-12">
      <h3 className="text-2xl font-bold mb-8 text-gray-900">OUR LOCATIONS</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cities.map((city, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer group border border-gray-200">
            <div className="h-32 bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-3xl">🏙️</div>
            </div>
            <div className="p-4 text-center">
              <h4 className="font-medium text-gray-900">{city}</h4>
              <button className="mt-2 text-xs text-emerald-600 hover:text-emerald-700">VISIT STORE</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}