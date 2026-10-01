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
    <div key={`downloads_container_${dataset_name}`}>
      <Tabs
        value={activeTab}
        onValueChange={onSelectTab}
        className="w-full"
      >
        {/* Tabs */}
        <TabsList
          className="
            flex flex-wrap
            gap-1
            mb-0
            px-3
            bg-transparent
            h-auto
            items-end
          "
        >
        {Object.values(tabs).map((tab) => {
        const isActive = activeTab === tab.name;

        return (
            <TabsTrigger
            key={tab.name}
            value={tab.name}
            className="
                relative
                px-4 py-3
                text-sm font-medium
                transition-colors
                rounded-t-lg
                rounded-b-none
                border
            "
            style={{
                backgroundColor: isActive
                ? `${tab.color}30`
                : tab.color || "var(--muted)",

                borderColor: tab.color || "#e5e7eb",

                // Active tab merges into panel below
                borderBottomColor: isActive
                ? `${tab.color}30`
                : tab.color || "#e5e7eb",

                // Put active tab over panel's top border
                zIndex: isActive ? 2 : 1,

                // Extend it slightly over the panel
                marginBottom: isActive ? "-1px" : "0",
            }}
            >
            {tab.display_name}
            </TabsTrigger>
        );
        })}
        </TabsList>

        {/* Content */}
        {Object.values(tabs).map((tab) => (
            <TabsContent
            key={tab.name}
            value={tab.name}
            className="
                mt-0
                rounded-xl
                border
                shadow-sm
                p-5 sm:p-6
            "
            style={{
                backgroundColor: tab.color
                ? `${tab.color}30`
                : "#f9f9f9",
                borderColor: tab.color || "#e5e7eb",
            }}
            >
            <DownloadGuide
              tabName={tab.name}
              displayName={tab.display_name}
            />

            <div className="mt-7 pt-5 border-t border-black/10">
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