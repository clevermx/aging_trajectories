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
        {/* Tab headers */}
        <TabsList
          className="
            relative
            z-10
            flex
            flex-wrap
            items-end
            gap-1
            h-auto
            mb-0
            px-3
            bg-transparent
          "
        >
          {Object.values(tabs).map((tab) => {
            const isActive = activeTab === tab.name;

            const panelColor = tab.color
              ? `${tab.color}30`
              : "#f9f9f9";

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
                    ? panelColor
                    : tab.color || "var(--muted)",

                    borderColor: tab.color || "#e5e7eb",

                    // Remove bottom border from selected tab
                    borderBottomColor: isActive
                    ? "transparent"
                    : tab.color || "#e5e7eb",

                    zIndex: isActive ? 20 : 10,

                    // Move active tab over panel border
                    marginBottom: isActive ? "-1px" : "0",
                }}
                >
                {tab.display_name}
                </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab content */}
        {Object.values(tabs).map((tab) => {
          const panelColor = tab.color
            ? `${tab.color}30`
            : "#f9f9f9";

          return (
            <TabsContent
              key={tab.name}
              value={tab.name}
              className="
                relative
                z-0
                mt-0

                rounded-t-none
                rounded-b-xl

                border
                shadow-sm

                p-5 sm:p-6
              "
              style={{
                backgroundColor: panelColor,
                borderColor: tab.color || "#e5e7eb",

                // Pull panel under active tab.
                marginTop: "-1px",
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
          );
        })}
      </Tabs>
    </div>
  );
};