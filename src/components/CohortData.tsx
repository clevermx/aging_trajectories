import React from 'react';
import { Users, MapPin, Calendar } from "lucide-react";
import { X } from 'lucide-react';
import { MyLink } from './MyLink';
import './CohortData.css'
import { FileTabData } from './FilesComponent';
import { PopulationData } from './PopulationData';

//     "soundLife": {
//         "title": "Sound Life",
//         "eth": [
//             "African American",
//             "Asian",
//             "Caucasian",
//             "Hispanic or Latin American"
//         ],
//         "donors": 3,
//         "position": [
//             132,
//             100
//         ],
//         "color": "#C4B454",
//         "line_to": "",
//         "links": {
//             "download": [
//                 {
//                     "type": "scn",
//                     "link": "empty_link_for_now"
//                 },
//                 {
//                     "type": "synapse",
//                     "link": "empty_link_for_now"
//                 }
//             ],
//             "view": [
//                 {
//                     "type": "scn",
//                     "link": "empty_link_for_now"
//                 }
//             ]
//         }
//     }
// }

export class CohortData {
    name: string;
    title: string;
    eth: string[];
    donors: number;
    position: { x: number, y: number };
    color: string;
    line_to: string;
    links: {
        download: MyLink[],
        view: MyLink
    }
    files?: FileTabData;
    constructor(
        name: string,
        title: string,
        eth: string[],
        donors: number,
        position: number[],
        color: string,
        line_to: string,
        links: any
    ) {
        this.name = name;
        this.title = title;
        this.eth = eth;
        this.donors = donors
        this.position = { x: position[0], y: position[1] };
        this.color = color;
        this.line_to = line_to;
        this.color = color;
        this.links = links

    }

  async fetchFilesFromLinks(): Promise<void> {
    if (!this.links?.download) return;

    const filePromises = this.links.download
      .map(link => {
        if (link.type == "scn") {
          return (PopulationData.fillFilesFromSCNLink(this.name, this.name, link.link, true))
        } else {
          return ({
            name: this.name,
            display_name: this.name,
            files: [
              {
                name: this.name + ":additional downloads",
                path: "",
                size: 0,
                mtime: 0,
                link: link.link,
                description: link.description || (link.type + " link")
              }
            ]
          })
        };
      });
    const allFiles = await Promise.all(filePromises);

    this.files = {
      name: this.name,
      display_name: this.name,
      files: allFiles.flatMap(f => f?.files ?? [])
    };
    this.files.color = this.color
  }
}

interface CohortInfoProps {
    cohort: CohortData | null;
    onClose?: () => void;
    style: React.CSSProperties;
}
export const CohortInfo: React.FC<CohortInfoProps> = ({ cohort, onClose, style }) => {

    if (!cohort) {
        console.log("empty cohort");
        return null;
    }
    return (
        <div
            className="bg-white rounded-md shadow-lg"
            style={{ ...style }}
        >
            <div
                className="flex items-center justify-between px-3 py-1 rounded-t-md animate-fade-in-up"
                style={{ backgroundColor: cohort.color }}
            >
                <h2 className="font-bold text-white">{cohort.title}</h2>
                {onClose && (
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X size={12} />
                    </button>
                )}
            </div>
            {/* Removed the 'space-y-3' class from this div */}
            <div className="p-3">
                <div className="flex items-center">
                    <Users className="text-blue-600 w-5 h-5 mr-3" />
                    <span className="font-semibold">Participants:</span>
                    <span className="ml-2 text-gray-700">{cohort.donors}</span>
                </div>
                <div className="flex items-center">
                    <Calendar className="text-purple-600 w-5 h-5 mr-3" />
                    <span className="font-semibold">Study Period:</span>
                    <span className="ml-2 text-gray-700">2021 – 2024</span>
                </div>
                <div> {/* This div now wraps the ethnicity list */}
                    {cohort.eth.map((ethnicity, index) => (
                        <p key={index} className="text-gray-700 leading-tight">
                            {ethnicity}
                        </p>
                    ))}
                </div>
            </div>
        </div>

    );
};
interface CohortCardProps {
    cohort: CohortData | null;
    onDownload: (cohort: string | null) => void;
    style: React.CSSProperties;
}
export const CohortCard: React.FC<CohortCardProps> = ({ cohort, onDownload, style }) => {
    if (!cohort) {
        console.log("empty cohort");
        return null;
    }
    return (

        <div style={{ ...style }}
        >
            <div
                className="cohort-card"
                style={{ backgroundColor: cohort.color }}
            >
                <h2 className="cohort-title">{cohort.title}</h2>

                <div className="button-row">
                    {/* View button */}
                    {cohort.links.view && (
                        <button className="cohort-button"
                            onClick={() => {
                                window.open(cohort.links.view.link, '_blank');

                            }}
                        >
                            View
                        </button>
                    )}
                    {/* Download button */}
                    {cohort.links.download && (
                        <button className="cohort-button"
                            onClick={() => {
                                onDownload(cohort.title);
                            }}
                        >
                            Download
                        </button>
                    )}
                </div>
            </div>
        </div>

    );
};
