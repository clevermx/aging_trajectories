import React from "react";
import {
  FilesComponent,
  FileTabData,
} from "@/components/FilesComponent";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import { DownloadGuide } from "@/components/DownloadGuide";

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
  onSelectTab,
}) => {
  const firstTab = Object.values(tabs)[0]?.name;
  const activeTab = selectedTab || firstTab;

  return (
    <div key={"downloads_container_" + dataset_name}>
      <Tabs
        value={activeTab}
        onValueChange={(val) => onSelectTab(val)}
        className="w-full"
      >
        {/* Tab headers */}
        <TabsList className="flex flex-wrap gap-1 mb-4 border-gray-200 bg-transparent">
          {Object.values(tabs).map((tab) => (
            <TabsTrigger
              key={tab.name}
              value={tab.name}
              className="
                px-4 py-3 text-sm font-medium transition-colors
                rounded-lg
                data-[state=active]:text-white
              "
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
            className="mt-0"
          >
            <DownloadGuide
              tabName={tab.name}
              displayName={tab.display_name}
            />

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">
                Files ({tab.files.length})
              </h3>

              <FilesComponent
                data={tab}
                filesLoaded={true}
                key={`${dataset_name}_${tab.name}_downloads`}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};