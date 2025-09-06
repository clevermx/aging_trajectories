// PopulationGrid.tsx
import React from 'react';
import { PopulationCard, PopulationData } from './PopulationData';
import { DataSet } from './PopulationJson';

export interface PopulationGridProps {
  data: DataSet;
  selectedPopulation: string | null;
  onSelectPopulation: (population: string | null) => void;
  onDownload: () => void;
}

export const PopulationGrid: React.FC<PopulationGridProps> = ({
  data,
  selectedPopulation,
  onSelectPopulation,
  onDownload,
}) => {
  const handleDownloadClick = (population: string | null) => {
    console.log("selected: ", population);
    onSelectPopulation(population);
    onDownload();
  };

  // Helper to check if a population has at least one link
  const hasLinks = (p: PopulationData) =>
    p?.links?.sc_link || p?.links?.bulk_link || (p?.links?.download?.length ?? 0) > 0;

  return (
    <div className="w-full lg:w-[90%] min-h-screen p-4 sm:p-8 mx-auto flex flex-col">
      {/* Header */}
      <div className="text-center mb-10 shrink-0">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          Explore Populations
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Click on any population to discover more
        </p>
      </div>

      {/* Grid of population cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Whole dataset card if it has links */}
        {hasLinks(data.data) && (
          <PopulationCard
            key={data.data.name}
            population={data.data}
            layout="grid"
            onClose={undefined}
            onDownload={() => handleDownloadClick(null)}
          />
        )}

        {/* Only clusters with links */}
        {Object.values(data.data.clusters)
          .filter((population) => hasLinks(population))
          .map((population) => (
            <PopulationCard
              key={population.name}
              population={population}
              layout="grid"
              onClose={undefined}
              onDownload={() => handleDownloadClick(population.name)}
            />
          ))}
      </div>
    </div>
  );
};

export default PopulationGrid;
