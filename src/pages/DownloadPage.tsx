import React from 'react';
import { WorldMap } from '../components/WorldMap';
import { CohortCard, CohortData } from '@/components/CohortData';
import { DataSet } from '@/components/PopulationJson';
import { FilesComponent } from '@/components/FilesComponent';
import { FilesViewer } from '@/components/FilesViewer';
import { FilesList } from '@/components/FilesList';

export interface DatasetDownloadPageProps {
    data: DataSet;
    cohorts: Record<string, CohortData>;
    selectedPopulation: string | null;
    onSelectPopulation: (population: string | null) => void;
    onDownload: () => void;
    listDownloads: boolean
}




export const DownloadPage: React.FC<DatasetDownloadPageProps> = ({
    data,
    cohorts,
    selectedPopulation,
    onSelectPopulation,
    onDownload,
    listDownloads
}) => {

    const filesData = {}
    filesData[data.data.name] = data.data.files
    Object.values(data.data.clusters).forEach(subset => {
        if (subset.files.files.length > 0) {
            filesData[subset.display_name] = subset.files
        }
    });
    const mergedCohortFiles = Object.values(cohorts)
        .flatMap((cohort) => cohort.files?.files ?? []);
    const cohorts_files = {}
    if (mergedCohortFiles.length > 0) {
        filesData["all_cohorts"] = {
            name: "all_cohorts",
            display_name: "Reannotated datasets",
            files: mergedCohortFiles,
            color: "#add8e6"

        };
    }
    return (
        <div className="w-full lg:w-[90%] min-h-screen p-4 sm:p-8 mx-auto flex flex-col">



                {/* Header */}
                <h2 className="text-4xl font-bold mb-4">Downloads</h2>
                {!listDownloads && <FilesViewer
                    tabs={filesData}
                    dataset_name={data.data.name}
                    selectedTab={selectedPopulation}
                    onSelectTab={onSelectPopulation}
                />}
                {listDownloads && <FilesList
                    tabs={filesData}
                    dataset_name={data.data.name}
                />}



        </div>

    );
};