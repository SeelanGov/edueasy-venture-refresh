import { cn } from '@/lib/utils';
import { Award, Bot, CheckCircle, Flag, School, Target, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface StatisticCardProps {
  value: string;
  label: string;
  description?: string;
  linkTo?: string;
  icon?: string;
  variant?: 'default' | 'compact' | 'featured';
  animateCount?: boolean;
  delay?: number;
  isTarget?: boolean;
}

const iconMap = {
  CheckCircle,
  Users,
  Award,
  School,
  Bot,
  Target,
  TrendingUp,
  Flag,
};

/**
 * StatisticCard
 * @description Function
 */
export const StatisticCard = ({
  value,
  label,
  description,
  linkTo,
  icon = 'CheckCircle',
  variant = 'default',
  animateCount = true,
  delay = 0,
  isTarget = false,
}: StatisticCardProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState('0');
  const [currentValue, setCurrentValue] = useState(0);

  const IconComponent = iconMap[icon as keyof typeof iconMap] || CheckCircle;

  // Parse target value from the value string
  const targetValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const increment = Math.max(1, Math.ceil(targetValue / 50));

  useEffect(() => {
    if (!animateCount) {
      setAnimatedValue(value);
      setIsVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);

      const animationTimer = setInterval(() => {
        setCurrentValue((prev) => {
          if (prev >= targetValue) {
            clearInterval(animationTimer);
            setAnimatedValue(value);
            return targetValue;
          }
          const newValue = prev + increment;
          setAnimatedValue(newValue.toString());
          return newValue;
        });
      }, 50);

      return () => clearInterval(animationTimer);
    }, delay);

    return () => clearTimeout(timer);
  }, [targetValue, increment, value, animateCount, delay]);

  const handleClick = () => {
    if (linkTo) {
      navigate(linkTo);
    }
  };

  const cardClasses = cn(
    'group relative overflow-hidden rounded-xl border transition-all duration-300',
    'hover:shadow-lg hover:-translate-y-1',
    linkTo && 'cursor-pointer hover:border-cap-teal/50',
    isTarget && 'border-l-4 border-l-cap-coral/60',
    variant === 'compact' && 'p-4',
    variant === 'default' && 'p-6',
    variant === 'featured' && 'p-8',
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
  );

  const iconClasses = cn(
    'mb-3 transition-colors duration-300',
    isTarget ? 'text-cap-coral group-hover:text-cap-coral/80' : 'group-hover:text-cap-teal',
    variant === 'compact' && 'w-6 h-6',
    variant === 'default' && 'w-8 h-8',
    variant === 'featured' && 'w-10 h-10',
  );

  const valueClasses = cn(
    'font-bold transition-all duration-500',
    isTarget ? 'text-cap-coral' : 'group-hover:text-cap-teal',
    variant === 'compact' && 'text-2xl',
    variant === 'default' && 'text-3xl',
    variant === 'featured' && 'text-4xl',
  );

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role={linkTo ? 'button' : 'article'}
      tabIndex={linkTo ? 0 : undefined}
      onKeyDown={(e) => {
        if (linkTo && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="relative z-10">
        {isTarget && (
          <div className="absolute -top-2 -right-2 bg-cap-coral text-white text-xs px-2 py-1 rounded-full font-medium">
            2025 Goal
          </div>
        )}

        <IconComponent className={iconClasses} />

        <div className={valueClasses}>
          {animateCount && !isVisible ? '0' : animatedValue || value}
        </div>

        <div
          className={cn(
            'font-medium text-gray-600 mt-1',
            variant === 'compact' && 'text-sm',
            variant === 'default' && 'text-base',
            variant === 'featured' && 'text-lg',
          )}
        >
          {label}
        </div>

        {description && variant !== 'compact' && (
          <p className="text-gray-500 text-sm mt-2">{description}</p>
        )}

        {linkTo && (
          <div className="mt-3 text-cap-teal text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Learn more →
          </div>
        )}
      </div>

      {/* Hover gradient effect */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          isTarget ? 'from-cap-coral/5 to-transparent' : 'from-cap-teal/5 to-transparent',
        )}
      />
    </div>
  );
};
