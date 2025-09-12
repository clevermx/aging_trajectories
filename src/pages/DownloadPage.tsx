import React, { useMemo } from 'react';
import { FilesViewer } from '@/components/FilesViewer';
import { FilesList } from '@/components/FilesList';
import { DataSet } from '@/components/PopulationJson';
import { CohortData } from '@/components/CohortData';
import { FileTabData } from '@/components/FilesComponent';

export interface DatasetDownloadPageProps {
  data: DataSet;
  cohorts: Record<string, CohortData>;
  selectedPopulation: string | null;
  onSelectPopulation: (population: string | null) => void; // if your FilesViewer expects onSelectTab, you can pass this through
  selectedTab: string | null;
  onSelectTab: (tab: string | null) => void;
  listDownloads: boolean;
}

export const DownloadPage: React.FC<DatasetDownloadPageProps> = ({
  data,
  cohorts,
  selectedPopulation,
  onSelectPopulation,
  selectedTab,
  onSelectTab,
  listDownloads,
}) => {
  // Build tabs safely & memoized
  const tabs: Record<string, FileTabData> = useMemo(() => {
    const out: Record<string, FileTabData> = {};

    // Root dataset files (if present)
    const rootFiles = data?.data?.files?.files ?? [];
    if (rootFiles.length > 0 && data?.data?.files) {
      out[data.data.name] = {
        ...data.data.files,
        name: data.data.name,
        display_name: data.data.display_name ?? data.data.name,
        color: data.data.color,
        files: rootFiles,
      };
    }

    // Subset/cluster files
    const clusters = data?.data?.clusters ?? {};
    Object.values(clusters).forEach((subset) => {
      const subsetFiles = subset?.files?.files ?? [];
      if (subsetFiles.length > 0 && subset.files) {
        const key = subset.name; // key should be unique (use .name)
        out[key] = {
          ...subset.files,
          name: subset.name,
          display_name: subset.display_name ?? subset.name,
          color: subset.color,
          files: subsetFiles,
        };
      }
    });

    // Merge cohorts’ files into a single tab
    const mergedCohortFiles = Object.values(cohorts).flatMap(
      (c) => c?.files?.files ?? []
    );
    if (mergedCohortFiles.length > 0) {
      out['all_cohorts'] = {
        name: 'all_cohorts',
        display_name: 'Reannotated datasets',
        color: '#add8e6',
        files: mergedCohortFiles,
      };
    }

    return out;
  }, [data, cohorts]);

  const hasTabs = Object.keys(tabs).length > 0;

  return (
    <div className="w-full lg:w-[90%] min-h-screen p-4 sm:p-8 mx-auto flex flex-col">
      <h2 className="text-4xl font-bold mb-4">Downloads</h2>

      {!hasTabs && (
        <p className="text-muted-foreground">
          No downloads are available yet.
        </p>
      )}

      {hasTabs &&
        (!listDownloads ? (
          <FilesViewer
            tabs={tabs}
            dataset_name={data.data.name}
            selectedTab={selectedTab}
            onSelectTab={(tabName) => {
              onSelectTab(tabName);
              if (tabName !== "all_cohorts") {
                onSelectPopulation(tabName);
              }
            }}

          />
        ) : (
          <FilesList tabs={tabs} dataset_name={data.data.name} />
        ))}
    </div>
  );
};