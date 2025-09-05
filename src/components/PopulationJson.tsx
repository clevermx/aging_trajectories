import { FileTabData } from "./FilesComponent";
import { PopulationData } from "./PopulationData";

export interface DataPoint {
  umap_1: number;
  umap_2: number;
  clustering: string;
  group: string;
}
interface UmapClusteringBorders {
  type: string;
  value: string;
  coords: string[];
  data: DataPoint[];
}
interface ClusteringCenterPoint {
  clustering: string;
  umap_1: number;
  umap_2: number;
  Text: string;
}
interface ClusteringCenters {
  type: string;
  value: string;
  coords: string[];
  data: ClusteringCenterPoint[];
}
export interface DataSet {
  data: PopulationData;
  plot_data?: {
    clustering_centers: ClusteringCenters;
    umap_clustering_borders: UmapClusteringBorders;
  }
}
