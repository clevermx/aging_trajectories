import React, { useEffect, useRef, useState } from "react";
import { DatasetViewer } from "../components/DatasetViewer";
import { PopulationData } from "../components/PopulationData";
import { CohortsPage } from "./CohortsPage";
import { FilesComponent } from "@/components/FilesComponent";
import { CohortData } from "@/components/CohortData";
import { DataSet } from "@/components/PopulationJson";
import PopulationGrid from "@/components/PopulationsGrid";
import { DownloadPage } from "./DownloadPage";

export interface JSONData {
    datasets: DataSet[];
}

export const MainPage: React.FC = () => {
    const [selectedPopulation, setSelectedPopulation] = useState<string | null>(null);
    const [data, setData] = useState<JSONData | null>(null);
    const [showExplore, setShowExplore] = useState(true);
    const [cohort_data, setCohorts] = useState<Record<string, CohortData>>({});
    const [isGrid, setIsGrid] = useState(true);
    const [listDownloads, setListDownloads] = useState(false);
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch("/dataset.config.json");
                const config = await response.json();

                const whole_dataset_data = new PopulationData({
                    name: config.datasets[0].name,
                    display_name: config.datasets[0].data.display_name,
                    description: config.datasets[0].data.description,
                    links: config.datasets[0].data.links,
                    annotation_details: config.datasets[0].data.annotation_details,
                    number_of_cells: config.datasets[0].data.number_of_cells,
                    color: config.datasets[0].data.color,
                });
                console.log("whole dataset color:", whole_dataset_data.color)

                await whole_dataset_data.fetchFilesFromLinks();

                const adjustedData = config.datasets[0].data.clusters;
                for (const clusterKey of Object.keys(adjustedData)) {
                    const cluster = adjustedData[clusterKey];
                    const subclusters: Record<string, PopulationData> = {};
                    if (cluster.clusters) {
                        for (const subcluster_key of Object.keys(cluster.clusters)) {
                            subclusters[subcluster_key] = new PopulationData({
                                name: subcluster_key,
                                display_name: cluster.clusters[subcluster_key].display_name || subcluster_key,
                                parent: cluster,
                            });
                        }
                    }
                    adjustedData[clusterKey] = new PopulationData({
                        name: clusterKey,
                        display_name: cluster.display_name,
                        parent: whole_dataset_data,
                        description: cluster.description,
                        clusters: subclusters,
                        links: cluster.links,
                        annotation_details: cluster.annotation_details,
                        number_of_cells: cluster.number_of_cells,
                        color: cluster.color,
                    });
                    await adjustedData[clusterKey].fetchFilesFromLinks();
                }

                whole_dataset_data.clusters = adjustedData;

                const result_data = {
                    datasets: [
                        {
                            data: whole_dataset_data,
                            plot_data: config.datasets[0].plot_data,
                        },
                    ],
                };
                setData(result_data);
            } catch (error) {
                console.error("Error fetching the data:", error);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const fetchCohorts = async () => {
            const response = await fetch("/cohorts.config.json");
            const data = await response.json();

            const parsed_cohorts: Record<string, CohortData> = {};

            for (const cohortKey of Object.keys(data.cohorts)) {
                const cohort = data.cohorts[cohortKey];

                const cohortObj = new CohortData(
                    cohortKey,
                    cohort.title,
                    cohort.eth,
                    cohort.donors,
                    cohort.position,
                    cohort.color,
                    cohort.line_to,
                    cohort.links
                );
                await cohortObj.fetchFilesFromLinks();

                parsed_cohorts[cohortKey] = cohortObj;
            }

            setCohorts(parsed_cohorts);
        };

        fetchCohorts();
    }, []);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            setShowExplore(container.scrollTop < 50);
        };

        container.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => container.removeEventListener("scroll", handleScroll);
    }, [scrollContainerRef.current]);
    if (!data) return <div>Loading dataset...</div>;

    return (
        <div className="relative w-full  overflow-hidden">
            <div
                ref={scrollContainerRef}
                className="h-screen w-full overflow-y-auto"
                onScroll={(e) => {
                    const target = e.target as HTMLDivElement;
                    setShowExplore(target.scrollTop < 50);
                }}
            >

                {/* Page 0: Intro */}
                <section className="min-h-screen p-8">
                    <CohortsPage cohorts={cohort_data} />
                </section>

                {/* Page 1: Toggle between Grid and DatasetViewer */}
                <section id="population_view" className="min-h-screen p-8 relative">
                    {/* Small toggle switch top-right */}
                    <div className="absolute top-4 right-6 flex items-center gap-2">
                        <span className="text-sm text-gray-600">Grid</span>
                        <button
                            onClick={() => setIsGrid((prev) => !prev)}
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isGrid ? "bg-blue-500" : "bg-green-500"
                                }`}
                        >
                            <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isGrid ? "translate-x-0" : "translate-x-6"
                                    }`}
                            />
                        </button>
                        <span className="text-sm text-gray-600">Atlas</span>
                    </div>

                    {isGrid ? (
                        <PopulationGrid
                            data={data.datasets[0]}
                            selectedPopulation={selectedPopulation}
                            onSelectPopulation={setSelectedPopulation}
                            onDownload={() => {
                                document.querySelector("#downloads")?.scrollIntoView({ behavior: "smooth" });
                            }}
                        />
                    ) : (
                        <DatasetViewer
                            data={data.datasets[0]}
                            selectedPopulation={selectedPopulation}
                            onSelectPopulation={setSelectedPopulation}
                            onDownload={() => {
                                document.querySelector("#downloads")?.scrollIntoView({ behavior: "smooth" });
                            }}
                        />
                    )}
                </section>

                <section id="downloads" className="min-h-screen p-8 relative">

                    <div className="absolute top-4 right-6 flex items-center gap-2">
                        <span className="text-sm text-gray-600">simplified</span>
                        <button
                            onClick={() => setListDownloads((prev) => !prev)}
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${listDownloads ? "bg-blue-500" : "bg-green-500"
                                }`}
                        >
                            <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${listDownloads ? "translate-x-0" : "translate-x-6"
                                    }`}
                            />
                        </button>
                        <span className="text-sm text-gray-600">tabs</span>
                    </div>




                    <DownloadPage
                        data={data.datasets[0]}
                        cohorts={cohort_data}
                        selectedPopulation={selectedPopulation}
                        onSelectPopulation={()=> {}}
                        onDownload={() => {
                            document.querySelector("#downloads")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        listDownloads={listDownloads} />
                </section>



                {/* Explore button */}
                {showExplore && (
                    <button
                        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition text-lg"
                        onClick={() => {
                            document.querySelector('#population_view')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Explore combined atlas
                        <span className="animate-bounce">↓</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default MainPage;