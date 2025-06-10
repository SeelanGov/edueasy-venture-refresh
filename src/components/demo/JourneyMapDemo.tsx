
export const JourneyMapDemo = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Your Progress</h3>
        <p className="text-gray-600">Follow your journey from registration to enrollment</p>
      </div>
      
      <div className="flex justify-between items-center">
        {[
          { step: "1", title: "ID Verification", completed: true },
          { step: "2", title: "Profile Setup", completed: false },
          { step: "3", title: "Applications", completed: false },
          { step: "4", title: "Enrollment", completed: false }
        ].map((item, index) => (
          <div key={item.step} className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
              item.completed ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {item.step}
            </div>
            <span className="text-sm font-medium text-gray-700">{item.title}</span>
            {index < 3 && (
              <div className={`hidden md:block w-24 h-1 mt-6 ${
                item.completed ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
