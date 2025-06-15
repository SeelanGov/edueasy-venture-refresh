
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Ayanda M.",
    quote:
      "My sponsor made my university dream come true. EduEasy made the process transparent and stress-free.",
    img: "/lovable-uploads/photo-1649972904349-6e44c42644a7",
  },
  {
    name: "Tebogo R.",
    quote:
      "Seeing my impact as a sponsor has been life-changing. The students' gratitude motivates me every day.",
    img: "/lovable-uploads/photo-1581091226825-a6a2a5aee158",
  },
];

export function TestimonialsSection() {
  return (
    <section className="container mx-auto py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Success Stories</h2>
      <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center">
        {testimonials.map((t, i) => (
          <Card key={i} className="flex flex-col items-center p-6 max-w-sm mx-auto shadow hover-scale">
            <img
              src={t.img}
              alt={t.name}
              className="w-16 h-16 rounded-full mb-3 object-cover border border-gray-200"
            />
            <div className="italic text-gray-700 text-center mb-2">&quot;{t.quote}&quot;</div>
            <div className="font-semibold text-cap-teal mt-1">{t.name}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
