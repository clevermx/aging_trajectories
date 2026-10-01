import React, { useMemo } from 'react';
import { FilesViewer } from '@/components/FilesViewer';
import { FilesList } from '@/components/FilesList';
import { DataSet } from '@/components/PopulationJson';
import { CohortData } from '@/components/CohortData';
import { FileTabData } from '@/components/FilesComponent';

export interface DatasetDownloadPageProps {
  data: DataSet;
  cohorts: Record<string, CohortData>;
  selectedTab: string | null;
  onSelectTab: (tab: string | null) => void;
  listDownloads: boolean;
}

export const DownloadPage: React.FC<DatasetDownloadPageProps> = ({
  data,
  cohorts,
  selectedTab,
  onSelectTab,
  listDownloads,
}) => {
  const tabs: Record<string, FileTabData> = useMemo(() => {
    const out: Record<string, FileTabData> = {};

    const rootFiles = data?.data?.files?.files ?? [];

    const cohortFiles = Object.values(cohorts).flatMap(
      (c) => c?.files?.files ?? []
    );

    const reannotatedFiles = [
      ...rootFiles,
      ...cohortFiles,
    ];

    if (reannotatedFiles.length > 0) {
      out['all_cohorts'] = {
        name: 'all_cohorts',
        display_name: 'Reannotated datasets',
        color: '#add8e6',
        files: reannotatedFiles,
      };
    }

    const clusters = data?.data?.clusters ?? {};

    Object.values(clusters).forEach((subset) => {
      const subsetFiles = subset?.files?.files ?? [];

      if (subsetFiles.length > 0 && subset.files) {
        out[subset.name] = {
          ...subset.files,
          name: subset.name,
          display_name: subset.display_name ?? subset.name,
          color: subset.color,
          files: subsetFiles,
        };
      }
    });

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
            onSelectTab={onSelectTab}
          />
        ) : (
          <FilesList tabs={tabs} dataset_name={data.data.name} />
        ))}
    </div>
  );
};