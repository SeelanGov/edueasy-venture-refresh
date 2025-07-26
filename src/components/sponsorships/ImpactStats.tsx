import { StatisticsGrid } from '@/components/home/StatisticsGrid';

/**
 * ImpactStats
 * @description Function
 */
export function ImpactStats(): void {
  return (
    <div className="my-8">
      <StatisticsGrid
        selectedStats={['studentsSupported', 'scholarshipsSecured']}
        variant="default"
        columns={2}
        className="max-w-2xl mx-auto"
        animateOnScroll={true}
      />
    </div>
  );
}
