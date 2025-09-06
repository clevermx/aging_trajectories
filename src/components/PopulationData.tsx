// File: PopulationData.ts
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Add a clear enum-like prop for layout
type PopulationCardLayout = "modal" | "inline" | "grid";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './ui/carousel';
import { FileTabData } from './FilesComponent';
import { MyLink } from './MyLink';

export function softenColor(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Blend toward gray (128, 128, 128)
  const grayFactor = 0.4; // 0 = pure color, 1 = pure gray
  const rSoft = Math.round(r * (1 - grayFactor) + 128 * grayFactor);
  const gSoft = Math.round(g * (1 - grayFactor) + 128 * grayFactor);
  const bSoft = Math.round(b * (1 - grayFactor) + 128 * grayFactor);

  return `rgba(${rSoft}, ${gSoft}, ${bSoft}, ${alpha})`;
}

export function getImagesForDataset(dataset: string, population: string): string[] {
  const imageFiles = [

    'all_atlas__0__correlation.png',
    'all_atlas__0__heatmap.png',
    'all_atlas__0__static umap.png',
    'all_atlas__main__cells per study.png',
    'all_atlas__main__heatmap.png',
    'all_atlas__main__proportions.png'

  ];
  return imageFiles.filter(file => file.startsWith(dataset + "__" + population));
}

export const MyImageCarousel = (images: string[]) => {
  return (
    <Carousel
      className="my-carousel mx-auto"
      style={{ width: "80%", maxWidth: 720 }}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="flex justify-center items-center h-full">
              <a href={`/images/${image}`} target="_blank" rel="noopener noreferrer">
                <img
                  src={`/images/${image}`}
                  alt={image}
                  className="preview-image max-h-48 object-contain rounded-lg shadow-sm border border-gray-300"
                  style={{ cursor: "pointer" }}
                />
              </a>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export const getLuminance = (hex: string): number => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 0;

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  // Calculate luminance using the sRGB Luma formula
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance;
};

// Build a same-origin relative URL for the SCN files endpoint
function toSameOriginScnFilesUrl(sc_link: string): string {
  try {
    // Works for absolute links (http/https)
    const u = new URL(sc_link);
    const token = u.searchParams.get("token");
    if (!token) throw new Error("Missing token in sc_link");

    // Always fetch via same-origin reverse proxy:
    // final path: /scn-m/scn/getFiles?token=...
    return `/scn-m/scn/getFiles?token=${encodeURIComponent(token)}`;
  } catch {
    // Fallback for already-relative links like "/scn-m/?token=..."
    const qIndex = sc_link.indexOf("?token=");
    const token = qIndex >= 0 ? sc_link.slice(qIndex + 7) : "";
    if (!token) throw new Error("Missing token in sc_link");
    return `/scn-m/scn/getFiles?token=${encodeURIComponent(token)}`;
  }
}

export class PopulationData {
  name: string;
  display_name: string;
  parent?: PopulationData;
  description?: string;
  links?: {
    download?: MyLink[],
    sc_link?: MyLink,
    bulk_link?: MyLink
  }
  number_of_cells?: number;
  annotation_details?: string;
  clusters: Record<string, PopulationData>;
  color?: string;
  files?: FileTabData;

  constructor(params: {
    name: string;
    display_name: string;
    parent?: PopulationData;
    description?: string;
    links?: any,
    clusters?: Record<string, PopulationData>;
    annotation_details?: string;
    number_of_cells?: number;
    color?: string;
    files?: FileTabData;
  }) {
    this.name = params.name;
    this.display_name = params.display_name;
    this.parent = params.parent;
    this.description = params.description;
    this.links = params.links;
    this.clusters = params.clusters ?? {};
    this.annotation_details = params.annotation_details;
    this.number_of_cells = params.number_of_cells;
    this.color = params.color;
    this.files = params.files;
  }

  softenColor(percent: number): string {
    return softenColor(this.color, percent);
  }

  async fetchFilesFromLinks(): Promise<void> {
    if (!this.links?.download) return;

    const filePromises = this.links.download
      .map(link => {
        if (link.type == "scn") {
          return (PopulationData.fillFilesFromSCNLink(this.name, this.display_name, link.link))
        } else {
          return ({
            name: this.name,
            display_name: this.display_name,
            files: [
              {
                name: "additional downloads",
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
      display_name: this.display_name,
      files: allFiles.flatMap(f => f?.files ?? [])
    };
    this.files.color = this.color
  }


  public static async fillFilesFromSCNLink(
    name: string,
    display_name: string,
    sc_link: string

  ): Promise<FileTabData> {
    try {
      // Convert "https://.../scn-m/?token=XYZ" → "/scn-m/scn/getFiles?token=XYZ"
      const filesUrl = toSameOriginScnFilesUrl(sc_link);

      const response = await fetch(filesUrl, { credentials: "same-origin" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fileList = await response.json();
      return {
        name,
        display_name,
        files: fileList,
      };
    } catch (error) {
      console.error("Failed to fetch file data:", error);
      return undefined;
    }
  }
}



interface PopulationCardProps {
  population: PopulationData;
  onClose?: () => void;
  onDownload?: () => void;
  style_extra?: React.CSSProperties;
  layout?: PopulationCardLayout; // <-- instead of isModal + gridLayout
}

export const PopulationCard = ({
  population,
  onClose,
  onDownload,
  style_extra,
  layout = "modal",
}: PopulationCardProps) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {

    if (population.parent) {
      const files = getImagesForDataset(population.parent.name, population.name);
      setImages(files);
    } else {
      const files = getImagesForDataset(population.name, "main");
      setImages(files);
    }


  }, [population.parent, population.name]);

  // Wrapper styles
  const wrapperClasses =
    layout === "modal"
      ? "fixed inset-0 z-30 flex items-center justify-center p-4"
      : layout === "inline"
        ? "relative p-4"
        : "p-2"; // grid layout: no backdrop, fits inside grid container
  // Card styles
  const cardClasses =
    layout === "modal"
      ? "info-panel-modal max-h-[90vh] w-full max-w-4xl overflow-hidden flex flex-col animate-fade-in-up"
      : layout === "inline"
        ? "info-panel"
        : "info-panel-grid rounded-xl shadow-md flex flex-col"; // grid cards
  return (
    <div className={wrapperClasses} style={style_extra}>
      <div
        className={cardClasses}
        style={{
          backgroundColor: population.color ? `${population.color}4D` : "#ddd",
          border: `2px solid ${population.softenColor(10)}`,
        }}
        id={population.name + "_" + layout}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 flex-shrink-0">
          <h2 className="text-xl font-bold">{population.display_name}</h2>
          {layout === "modal" && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/10 transition"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Description */}

        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          {population.number_of_cells && population.clusters && Object.keys(population.clusters).length > 0 ? (
            <p className="text-sm text-gray-500">
              {population.number_of_cells.toLocaleString()} cells ·{" "}
              {Object.keys(population.clusters).length} clusters
            </p>
          ) : (
            <p className="text-gray-600 text-base leading-relaxed italic">
              {population.description ?? "No description available."}
            </p>
          )}
        </div>




        {/* Collapsible */}
        {layout !== "grid" && (
          <details className="bg-white/30 rounded-lg p-3 mx-6 my-2">
            <summary className="cursor-pointer font-semibold">
              Annotation Details
            </summary>
            <p className="mt-2 text-sm leading-relaxed">
              {population.annotation_details || "No details available."}
            </p>
            {/* Figures */}
            {images.length > 0 && (
              <section className="px-6 py-2">
                <h3 className="text-base font-semibold mb-2">related figures:</h3>
                <div>{MyImageCarousel(images)}</div>
              </section>
            )}
          </details>
        )}


        {/* Navigation */}
        <footer className="flex flex-col items-center gap-4 px-6 py-4 border-t border-gray-300 flex-shrink-0">
          <div className="flex gap-4">
            {population.links.sc_link && (
              <a
                href={population.links.sc_link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-lg bg-white/50 hover:bg-white/40 transition text-sm font-medium"
              >
                Single Cell
              </a>
            )}
            {population.links.bulk_link && (
              <a
                href={population.links.bulk_link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-lg bg-white/50 hover:bg-white/40 transition text-sm font-medium"
              >
                Pseudobulk
              </a>
            )}
          </div>

          {/* Download invitation  */}

          <div className="mt-3 flex items-center justify-center text-sm text-muted-foreground">
            <button
              onClick={() => {
                if (onDownload) onDownload();
              }}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
              </svg>
              <span>View subset downloads</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};