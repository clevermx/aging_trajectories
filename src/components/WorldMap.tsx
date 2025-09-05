import { useEffect, useState } from 'react';
import { CohortData, CohortInfo } from '../components/CohortData';
import { assetUrl } from '@/utils/assets';

export interface RegionData {
  "title": string;
  "desc": string;
  "d": string;
  "color": string;
  "cohorts": string[];
}

interface WorldMapProps {
  cohorts: Record<string, CohortData>;
}
export const WorldMap: React.FC<WorldMapProps> = (input) => {
  const [region_data, setRegions] = useState<Record<string, RegionData>>({});
  const [selectedCohorts, setSelectedCohort] = useState<string[] | null>(null);
  useEffect(() => {
    const url = assetUrl("regions.config.json");
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const parsed_regions: Record<string, RegionData> = {};
        Object.keys(data.regions).forEach(regionKey => {
          const region = data.regions[regionKey];
          parsed_regions[regionKey] = {
            title: region.title,
            desc: region.desc,
            d: region.d,
            color: region.color,
            cohorts: region.cohorts
          };
        });
        setRegions(parsed_regions);
      });
  }, []);



  const SVG_WIDTH: number = 960;
  const SVG_HEIGHT: number = 522;

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <image
          href={assetUrl("images/intro_page/empty_map.png")}
          x="0"
          y="0"
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
        />
        {region_data && Object.keys(region_data).length > 0 &&
          Object.keys(region_data).map(region => (
            <g
              key={region}
              onClick={() => {
                // Get the cohorts for the clicked region
                const newCohorts = region_data[region].cohorts;
                const hasDuplicate = selectedCohorts && newCohorts.some(cohort => selectedCohorts.includes(cohort));
                if (!hasDuplicate) {
                  const updatedCohorts = selectedCohorts ? [...selectedCohorts, ...newCohorts] : newCohorts;
                  setSelectedCohort(updatedCohorts);
                } else {
                  const reduced_cohorts = selectedCohorts.filter((x) => !newCohorts.includes(x));
                  setSelectedCohort(reduced_cohorts);
                }


              }}
              style={{ transition: 'transform 0.5s' }}
            >
              <path
                key={`${region}-path`}
                d={region_data[region].d}
                transform={``}
                fill={region_data[region].color}
                stroke="none"
                style={{ transition: 'transform 0.5s' }}
              />
            </g>
          ))}
      </svg>
      {
        selectedCohorts && selectedCohorts.length > 0 && selectedCohorts.map(cohortKey => {
          const cohortData = input.cohorts[cohortKey as keyof typeof input.cohorts];
          if (!cohortData) return null;

          // Calculate percentage-based top and left values
          const topPercentage = (cohortData.position.x / SVG_HEIGHT) * 100;
          const leftPercentage = (cohortData.position.y / SVG_WIDTH) * 100;

          return (
            <div className="z-50" key={`${cohortKey}-info-container`} style={{ position: 'absolute', top: `${topPercentage}%`, left: `${leftPercentage}%` }}>
              <CohortInfo
                key={`${cohortKey}-info`}
                cohort={cohortData}
                onClose={() => setSelectedCohort(selectedCohorts.filter((x) => x !== cohortKey))}
                style={{
                  position: 'absolute',
                  top: `0%`,
                  left: `0%`
                }}
              />
            </div>
          );
        })
      }
    </div >
  );
};