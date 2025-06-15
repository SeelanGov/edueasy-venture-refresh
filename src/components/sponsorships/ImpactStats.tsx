
import { CircleDollarSign, Book, Star } from "lucide-react";

const stats = [
  {
    icon: Star,
    label: "Active Sponsors",
    value: "326",
  },
  {
    icon: CircleDollarSign,
    label: "Total Sponsored (ZAR)",
    value: "1,850,350",
  },
  {
    icon: Book,
    label: "Students Assisted",
    value: "2,942",
  },
];

export function ImpactStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col items-center rounded-lg bg-white px-6 py-6 shadow hover-scale border border-cap-teal/10 animate-fade-in">
          <stat.icon className="w-9 h-9 text-cap-teal mb-2" />
          <div className="text-3xl font-bold text-cap-teal drop-shadow">{stat.value}</div>
          <div className="text-gray-600 text-sm mt-2">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
