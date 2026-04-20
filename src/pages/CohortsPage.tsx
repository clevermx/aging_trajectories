import React from 'react';
import { WorldMap } from '../components/WorldMap';
import { CohortCard, CohortData } from '@/components/CohortData';
import { assetUrl } from '@/utils/assets';

interface CohortsPageProps {
  cohorts: Record<string, CohortData>;
  onDownload: () => void;
}

export const CohortsPage: React.FC<CohortsPageProps> = (input) => {
  return (
    <div className="relative w-full h-full px-8 pt-4 pb-16 space-y-6">
      {/* Header block */}
      <div className="text-center space-y-1">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          Aging immuno-diversity
        </h1>
        <p className="text-muted-foreground text-lg">
          largest human PBMC scRNA-seq dataset
        </p>
      </div>

      {/* Main container for the two-column layout */}
      <div className="flex w-full mt-6 items-stretch">
        {/* Column 1: World Map (70%) */}
        <div className="basis-[70%] flex-1">
          <WorldMap cohorts={input.cohorts} />
        </div>

        {/* Column 2: Image + Rectangle (30%) */}
        <div className="basis-[30%] flex flex-col">
          <div className="flex-1">
            <img
              src={assetUrl("images/intro_page/design.png")}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex items-centerr">
            <div className="w-full max-w-xs bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
              <div className="space-y-3">
                <p className="text-4xl font-bold text-red-800">
                  8 <span className="text-2xl font-medium text-gray-600">datasets</span>
                </p>

                <p className="text-4xl font-bold text-red-800">
                  2609 <span className="text-2xl font-medium text-gray-600">donors</span>
                </p>

                <p className="text-4xl font-bold text-red-800">
                  12.3M <span className="text-2xl font-medium text-gray-600">cells</span>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Suggestion text */}
      <div className="text-center mt-8">
        <p className="text-xl font-medium text-foreground">
          View or download reannotated datasets
        </p>
      </div>

      {/* Container for Cohort Cards */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {Object.keys(input.cohorts).length > 0 &&
          Object.keys(input.cohorts).map((cohort_name) => (
            <CohortCard
              key={cohort_name}
              cohort={input.cohorts[cohort_name]}
              onDownload={input.onDownload}
              style={undefined}
            />
          ))}
      </div>
    </div>
  );
};