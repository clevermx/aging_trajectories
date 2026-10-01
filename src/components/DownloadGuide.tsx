import React from "react";
import { Database, Table2, ScatterChart, FileText } from "lucide-react";

interface DownloadGuideProps {
  tabName: string;
  displayName: string;
  compact?: boolean;
}

const StructureItem = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => (
  <div
    className="
      grid
      grid-cols-1
      sm:grid-cols-[140px_1fr]
      gap-1 sm:gap-3
      text-sm
      leading-relaxed
    "
  >
    <code className="font-semibold text-gray-900 whitespace-nowrap">
      {name}
    </code>

    <div className="text-gray-700 min-w-0">
      {children}
    </div>
  </div>
);
const AnnotationTable = () => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-1">
      Cell-type annotations
    </h3>

    <p className="text-sm text-gray-600 mb-3">
      Cell annotations are available in the metadata and AnnData objects.
    </p>

    <div className="overflow-x-auto rounded-lg border border-black/10 bg-white/50">
      <table className="w-full text-sm text-left">
        <thead className="bg-white/40">
          <tr>
            <th className="px-4 py-2 font-semibold">Column</th>
            <th className="px-4 py-2 font-semibold">Description</th>
            <th className="px-4 py-2 font-semibold">Example values</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-black/10">
          <tr>
            <td className="px-4 py-2">
              <code>author_celltype</code>
            </td>
            <td className="px-4 py-2">
              Original annotation from the source dataset
            </td>
            <td className="px-4 py-2">
              B cell, CD4 T cell, classical monocyte
            </td>
          </tr>

          <tr>
            <td className="px-4 py-2">
              <code>major_celltypes</code>
            </td>
            <td className="px-4 py-2">
              Harmonized broad cell type/lineage
            </td>
            <td className="px-4 py-2">
              B, CD4 T, CD8 T, NK, Myeloid
            </td>
          </tr>

          <tr>
            <td className="px-4 py-2">
              <code>minor_celltypes</code>
            </td>
            <td className="px-4 py-2">
              Harmonized detailed subtype
            </td>
            <td className="px-4 py-2">
              Naive, HLA-DR+ memory, Classical monocytes
            </td>
          </tr>

          <tr>
            <td className="px-4 py-2">
              <code>annotation</code>
            </td>
            <td className="px-4 py-2">
              Final combined annotation used in this study
            </td>
            <td className="px-4 py-2">
              B Naive, CD4+ T HLA-DR+ memory
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const GuideSection = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex gap-3">
    <div className="shrink-0 mt-0.5 text-gray-700">
      {icon}
    </div>

    <div className="min-w-0">
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-sm text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

export const DownloadGuide: React.FC<DownloadGuideProps> = ({
  tabName,
  displayName,
  compact = false,
}) => {
  const isDatasetTab = tabName === "all_cohorts";

  if (isDatasetTab) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-1">
          Reannotated datasets
        </h3>

        <p className="text-sm text-gray-700 mb-5">
          Each <code>*_reannotated.h5ad</code> file contains one source
          dataset with harmonized cell-type annotations.
        </p>

        <div className="space-y-5">
          <GuideSection
            icon={<Database size={21} />}
            title="Dataset AnnData files"
          >
            <div className="space-y-1.5 mt-2">
              <StructureItem name=".X">
                Normalized, log-transformed expression
              </StructureItem>

              <StructureItem name=".raw.X">
                Raw UMI counts
              </StructureItem>

              <StructureItem name=".obs">
                Cell and donor metadata, including original and harmonized
                cell-type annotations
              </StructureItem>

              <StructureItem name='.obsm["X_umap"]'>
                Original dataset UMAP coordinates, when available
              </StructureItem>

              <StructureItem name=".obs_names">
                Cell IDs corresponding to the <code>barcode</code> column
                in the all-cells metadata
              </StructureItem>
            </div>
          </GuideSection>

          <GuideSection
            icon={<FileText size={21} />}
            title="All-cells metadata"
          >
            <code>all_cells_metadata.csv.gz</code> contains complete
            cell-level metadata across all datasets.
          </GuideSection>
        </div>

        {!compact && <AnnotationTable />}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-1">
        Integrated cell-type data
      </h3>

      <p className="text-sm text-gray-700 mb-5">
        {displayName} are provided in several formats for visualization
        and downstream analysis.
      </p>

      <div className="space-y-5">
        <GuideSection
          icon={<Database size={21} />}
          title="Normalized expression (.h5ad)"
        >
          <div className="space-y-1.5 mt-2">
            <StructureItem name=".X">
              Normalized, log-transformed expression for the common gene
              set shared across datasets
            </StructureItem>

            <StructureItem name=".obs">
              Cell and donor metadata
            </StructureItem>

            <StructureItem name=".obsm">
              PCA, Harmony and integrated UMAP coordinates, where applicable
            </StructureItem>
          </div>
        </GuideSection>

        <GuideSection
          icon={<Database size={21} />}
          title="Raw counts (.h5ad)"
        >
          <div className="space-y-1.5 mt-2">
            <StructureItem name=".X">
              Raw UMI counts for the full set of available genes
            </StructureItem>

            <StructureItem name=".obs">
              Cell and donor metadata
            </StructureItem>

            <StructureItem name=".obsm">
              Integrated UMAP coordinates
            </StructureItem>

          </div>
        </GuideSection>

        <GuideSection
          icon={<Table2 size={21} />}
          title="Metadata (.csv)"
        >
          Cell and donor metadata, including original and harmonized
          cell-type annotations.
        </GuideSection>

        <GuideSection
          icon={<ScatterChart size={21} />}
          title="UMAP coordinates (.tsv)"
        >
          Final integrated UMAP coordinates in a simple tab-separated format.
        </GuideSection>
      </div>

      <div className="mt-5 rounded-lg bg-white/50 border border-black/10 px-4 py-3 text-sm">
        <strong>
          Normalized and raw-count files contain the same cells but different
          gene sets.
        </strong>{" "}
      </div>

      {!compact && <AnnotationTable />}
    </div>
  );
};

export const SimplifiedDownloadGuide = () => (
  <div className="mb-10">
    <h2 className="text-xl font-semibold mb-2">
      About these files
    </h2>

    <p className="text-sm text-gray-700 mb-6">
      Downloads include integrated cell-type subsets, individually
      reannotated source datasets, and cell-level metadata.
    </p>

    {/* Integrated subsets */}
    <div className="mb-7">
      <h3 className="text-lg font-semibold mb-2">
        Integrated cell-type data
      </h3>

      <div className="space-y-5">
        <GuideSection
          icon={<Database size={21} />}
          title="Normalized expression (.h5ad)"
        >
          <div className="space-y-1.5 mt-2">
            <StructureItem name=".X">
              Normalized, log-transformed expression for the common gene
              set shared across datasets
            </StructureItem>

            <StructureItem name=".obs">
              Cell and donor metadata
            </StructureItem>

            <StructureItem name=".obsm">
              PCA, Harmony and integrated UMAP coordinates, where applicable
            </StructureItem>
          </div>
        </GuideSection>

        <GuideSection
          icon={<Database size={21} />}
          title="Raw counts (.h5ad)"
        >
          <div className="space-y-1.5 mt-2">
            <StructureItem name=".X">
              Raw UMI counts for the full set of available genes
            </StructureItem>

            <StructureItem name=".obs">
              Cell and donor metadata
            </StructureItem>

            <StructureItem name=".obsm">
              Integrated UMAP coordinates
            </StructureItem>

          </div>
        </GuideSection>

        <GuideSection
          icon={<Table2 size={21} />}
          title="Metadata (.csv)"
        >
          Cell and donor metadata, including original and harmonized
          cell-type annotations.
        </GuideSection>

        <GuideSection
          icon={<ScatterChart size={21} />}
          title="UMAP coordinates (.tsv)"
        >
          Final integrated UMAP coordinates in a simple tab-separated format.
        </GuideSection>
      </div>

      <div className="mt-5 rounded-lg bg-orange-50 border border-orange-200 px-4 py-3 text-sm">
        <strong>
          Normalized and raw-count files contain the same cells but
          different gene sets.
        </strong>{" "}
        Cell order may differ between files. Match cells by cell ID rather
        than row position.
      </div>
    </div>

    {/* Reannotated datasets */}
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold mb-2">
        Reannotated datasets
      </h3>

      <p className="text-sm text-gray-700 mb-4">
        Each <code>*_reannotated.h5ad</code> file contains one source
        dataset with harmonized cell-type annotations.
      </p>

      <div className="space-y-1.5">
        <StructureItem name=".X">
          Normalized, log-transformed expression
        </StructureItem>

        <StructureItem name=".raw.X">
          Raw UMI counts
        </StructureItem>

        <StructureItem name=".obs">
          Cell and donor metadata, including original and harmonized
          cell-type annotations
        </StructureItem>

        <StructureItem name='.obsm["X_umap"]'>
          Original dataset UMAP coordinates, when available
        </StructureItem>

        <StructureItem name=".obs_names">
          Cell IDs corresponding to the <code>barcode</code> column in
          the all-cells metadata
        </StructureItem>
      </div>

      <p className="text-sm text-gray-700 mt-4">
        <code>all_cells_metadata.csv.gz</code> contains complete
        cell-level metadata across all datasets.
      </p>
    </div>

    <AnnotationTable />
  </div>
);