import React from "react";
import { FileText, Database, Table2, ScatterChart } from "lucide-react";

interface DownloadGuideProps {
  tabName: string;
  displayName: string;
}

const AnnotationTable = () => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-1">
      Cell-type annotations
    </h3>

    <p className="text-sm text-gray-600 mb-3">
      Cell annotations are available in the metadata and AnnData objects.
    </p>

    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 font-semibold">Column</th>
            <th className="px-4 py-2 font-semibold">Description</th>
            <th className="px-4 py-2 font-semibold">Example values</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
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

const GuideRow = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex gap-4">
    <div className="shrink-0 mt-0.5 text-gray-700">
      {icon}
    </div>

    <div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

export const DownloadGuide: React.FC<DownloadGuideProps> = ({
  tabName,
  displayName,
}) => {
  const isDatasetTab = tabName === "all_cohorts";

  if (isDatasetTab) {
    return (
      <div className="mb-6">
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5">
          <h3 className="text-xl font-semibold mb-1">
            Reannotated datasets
          </h3>

          <p className="text-sm text-gray-700 mb-5">
            Individual datasets with harmonized cell-type annotations,
            together with complete cell-level metadata across all datasets.
          </p>

          <div className="space-y-4">
            <GuideRow
              icon={<FileText size={22} />}
              title="Dataset files (*_reannotated.h5ad)"
            >
              Each file contains one source dataset. Normalized,
              log-transformed expression is stored in{" "}
              <code>.X</code>, raw UMI counts in{" "}
              <code>.raw.X</code>, cell and donor metadata in{" "}
              <code>.obs</code>, and original dataset UMAP coordinates
              in <code>.obsm["X_umap"]</code> when available.
            </GuideRow>

            <GuideRow
              icon={<Table2 size={22} />}
              title="All-cells metadata (all_cells_metadata.csv.gz)"
            >
              Complete cell-level metadata across all datasets. Cell IDs
              correspond to <code>.obs_names</code> in the dataset
              AnnData files.
            </GuideRow>
          </div>
        </div>

        <AnnotationTable />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="rounded-xl border border-gray-200 bg-white/60 p-5">
        <h3 className="text-xl font-semibold mb-1">
          Integrated cell-type data
        </h3>

        <p className="text-sm text-gray-700 mb-5">
          {displayName} are provided in several formats for different
          downstream applications.
        </p>

        <div className="space-y-4">
          <GuideRow
            icon={<Database size={22} />}
            title="Normalized expression (.h5ad)"
          >
            Normalized, log-transformed expression for the{" "}
            <strong>common gene set shared across datasets</strong>.
            Use for visualization and expression-based analyses.
          </GuideRow>

          <GuideRow
            icon={<Database size={22} />}
            title="Raw counts (.h5ad)"
          >
            Raw UMI counts for the{" "}
            <strong>full set of available genes</strong>. Use for
            pseudobulk differential expression and other count-based
            analyses.
          </GuideRow>

          <GuideRow
            icon={<Table2 size={22} />}
            title="Metadata (.csv)"
          >
            Cell and donor metadata, including original and harmonized
            cell-type annotations.
          </GuideRow>

          <GuideRow
            icon={<ScatterChart size={22} />}
            title="UMAP coordinates (.tsv)"
          >
            Final integrated UMAP coordinates.
          </GuideRow>
        </div>

        <div className="mt-5 rounded-lg bg-orange-50 border border-orange-200 px-4 py-3 text-sm">
          <strong>
            Normalized and raw-count files contain the same cells but
            different gene sets.
          </strong>{" "}
        </div>
      </div>

      <AnnotationTable />
    </div>
  );
};