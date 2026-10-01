import React from "react";
import {
  FilesComponent,
  FileTabData,
} from "@/components/FilesComponent";
import { SimplifiedDownloadGuide } from "@/components/DownloadGuide";

export interface FilesListProps {
  dataset_name: string;
  tabs: Record<string, FileTabData>;
}

export const FilesList: React.FC<FilesListProps> = ({
  dataset_name,
  tabs,
}) => {
  return (
    <div className="w-full">
      {/* Description is shown only once */}
      <SimplifiedDownloadGuide />

      {/* Download sections */}
      {Object.values(tabs).map((tab) => (
        <div
          key={tab.name}
          className="mb-6 rounded-xl border p-5 sm:p-6"
          style={{
            backgroundColor: tab.color
              ? `${tab.color}30`
              : "#f9f9f9",
            borderColor: tab.color || "#e5e7eb",
          }}
        >
          <div className="flex items-baseline justify-between gap-4 mb-3">
            <h2 className="text-xl font-semibold">
              {tab.display_name}
            </h2>

            <span className="text-sm text-gray-500">
              {tab.files.length} {tab.files.length === 1 ? "file" : "files"}
            </span>
          </div>

          <FilesComponent
            data={tab}
            filesLoaded={true}
            key={`${dataset_name}_${tab.name}_downloads`}
          />
        </div>
      ))}
    </div>
  );
};