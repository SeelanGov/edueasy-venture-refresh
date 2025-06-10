
export const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Verify Your Identity",
      description: "Securely verify your South African ID to get started"
    },
    {
      step: "2", 
      title: "Complete Your Profile",
      description: "Add your educational background and preferences"
    },
    {
      step: "3",
      title: "Apply & Get Matched",
      description: "Apply to institutions and get matched with opportunities"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
