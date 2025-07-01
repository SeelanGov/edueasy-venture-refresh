
import React from 'react';
import { StatisticCard } from './StatisticCard';
import { EDUEASY_STATISTICS, StatisticKey } from '@/config/statistics';

interface StatisticsGridProps {
  variant?: 'default' | 'compact' | 'featured';
  columns?: 2 | 3 | 4 | 5;
  selectedStats?: StatisticKey[];
  animateOnScroll?: boolean;
  className?: string;
}

export const StatisticsGrid = ({
  variant = 'default',
  columns = 3,
  selectedStats,
  animateOnScroll = true,
  className = ''
}: StatisticsGridProps) => {
  const statsToShow = selectedStats 
    ? selectedStats.map(key => ({ key, ...EDUEASY_STATISTICS[key] }))
    : Object.entries(EDUEASY_STATISTICS).map(([key, value]) => ({ key, ...value }));

  const gridClasses = `grid gap-6 ${className} ${
    columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
    columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
    columns === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  }`;

  return (
    <div className={gridClasses}>
      {statsToShow.map((stat, index) => (
        <StatisticCard
          key={stat.key}
          value={stat.value}
          label={stat.label}
          description={stat.description}
          linkTo={stat.linkTo}
          icon={stat.icon}
          variant={variant}
          animateCount={animateOnScroll}
          delay={animateOnScroll ? index * 100 : 0}
        />
      ))}
    </div>
  );
};
