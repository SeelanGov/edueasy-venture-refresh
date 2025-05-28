
interface PatternBorderProps {
  children: React.ReactNode;
  className?: string;
}

const PatternBorder = ({ children, className = "" }: PatternBorderProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-cap-teal/20 to-cap-orange/20 rounded-lg"></div>
      <div className="relative bg-white rounded-lg p-6 m-1">
        {children}
      </div>
    </div>
  );
};

export default PatternBorder;
