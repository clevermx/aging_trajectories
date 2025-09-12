import React from 'react';
import { FilesComponent, FileTabData } from '@/components/FilesComponent';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { softenColor } from './PopulationData';


export interface FilesViewerProps {
    dataset_name: string;
    tabs: Record<string, FileTabData>;
    selectedTab: string | null;
    onSelectTab: (tab: string | null) => void;
}

export const FilesViewer: React.FC<FilesViewerProps> = ({
    dataset_name,
    tabs,
    selectedTab,
    onSelectTab

}) => {
    const defaultTab = selectedTab || Object.values(tabs)[0].name;
    const tabKeys = Object.keys(tabs);

    return (
        <div key={"downloads_container_" + dataset_name}>



            {/* Tabs for file groups */}
            <Tabs
                value={selectedTab || Object.values(tabs)[0].name}
                onValueChange={(val) => onSelectTab(val)} 
                className="w-full">
                {/* Tab headers */}
                <TabsList className="flex flex-wrap gap-1 mb-0 border-gray-200 bg-transparent">
                    {Object.values(tabs).map((tab) => (
                        <TabsTrigger
                            key={tab.name}
                            value={tab.name}
                            onClick={() => onSelectTab(tab.name)}
                            className={`
                                px-4 py-3 text-sm font-medium transition-colors
                                rounded-t-lg
                                data-[state=active]:border-b-0
                                data-[state=active]:rounded-b-none
                                data-[state=active]:text-white
                            `}
                            style={{
                                backgroundColor: tab.color || "var(--muted)",
                                opacity: 0.9,
                            }}
                        >
                            {tab.display_name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Tab content */}
                {Object.values(tabs).map((tab) => (
                    <TabsContent
                        key={tab.name}
                        value={tab.name}
                        className={`
                            hidden data-[state=active]:flex
                            flex-col rounded-b-xl shadow-md p-4
                        `}
                        style={{
                            backgroundColor: tab.color ? `${tab.color}50` : "#f9f9f9",
                            border: `1px solid ${tab.color || "var(--muted)"}`,
                            borderTop: '1px solid transparent'
                        }}
                    >
                        <FilesComponent
                            data={tab}
                            filesLoaded={true}
                            key={`${dataset_name}_${tab.name}_downloads`}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};