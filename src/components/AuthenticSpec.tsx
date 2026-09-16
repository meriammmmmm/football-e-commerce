interface Spec {
  name: string;
  description: string;
}

interface AuthenticSpecProps {
  specs: Spec[];
}

export default function AuthenticSpec({ specs }: AuthenticSpecProps) {
  return (
    <section className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-900">AUTHENTIC SPEC</h3>
        <a href="#" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">VIEW ALL →</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {specs?.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition cursor-pointer border border-gray-200">
            <div className="text-3xl mb-3">⚽</div>
            <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}