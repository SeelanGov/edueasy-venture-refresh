
export const PartnersSection = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-gray-900">
          Trusted by Leading Institutions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
          <div className="h-16 bg-gray-300 rounded flex items-center justify-center">
            <span className="text-sm font-medium">UCT</span>
          </div>
          <div className="h-16 bg-gray-300 rounded flex items-center justify-center">
            <span className="text-sm font-medium">Wits</span>
          </div>
          <div className="h-16 bg-gray-300 rounded flex items-center justify-center">
            <span className="text-sm font-medium">UJ</span>
          </div>
          <div className="h-16 bg-gray-300 rounded flex items-center justify-center">
            <span className="text-sm font-medium">NWU</span>
          </div>
        </div>
      </div>
    </section>
  );
};
