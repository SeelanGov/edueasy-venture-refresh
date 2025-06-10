
export const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-gray-900">
          Student Success Stories
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">"EduEasy made the application process so much easier. The ID verification was quick and secure."</p>
            <p className="font-semibold">- Sarah M., UCT Student</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">"I found the perfect program match through EduEasy's personalized recommendations."</p>
            <p className="font-semibold">- Thabo K., Wits Student</p>
          </div>
        </div>
      </div>
    </section>
  );
};
