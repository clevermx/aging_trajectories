import React from 'react';
import { FilesComponent, FileTabData } from '@/components/FilesComponent';

export interface FilesListProps {
    dataset_name: string;
    tabs: Record<string, FileTabData>;
}

export const FilesList: React.FC<FilesListProps> = ({
    dataset_name,
    tabs
}) => {
    return (
        <div className="w-full lg:w-[90%] mx-auto p-4 sm:p-8">
            {Object.values(tabs).map(tab => (
                <div
                    key={tab.name}
                    className="p-6"
                >
                    <h2 className="text-xl font-semibold mb-4">
                        {tab.display_name}
                    </h2>
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