import React, { useState, useEffect } from 'react';
import { PopulationCard, PopulationData } from './PopulationData';
import { FileTabData } from './FilesComponent';
import { DataPoint, DataSet } from './PopulationJson';

// NEW: helper to decide if a population has any links
const hasLinks = (p?: PopulationData) =>
  !!(p?.links?.sc_link || p?.links?.bulk_link || (p?.links?.download?.length ?? 0) > 0);



const VIEWBOX_WIDTH = 900;
const VIEWBOX_HEIGHT = 450;
const FULL_WIDTH = 1000;
const FULL_HEIGHT = 500;
const OUTER_MARGIN = 50;
const TARGET_CLUSTER_WIDTH = VIEWBOX_WIDTH * 0.05;
const FIXED_RECT_WIDTH = 100;
const BASE_RECT_HEIGHT = 50;

const translateUMAPToSVG = (umap: number, rangeLow: number, rangeHigh: number, size: number): number => {
  const scaleFactor = size / (rangeHigh - rangeLow);
  return (umap - rangeLow) * scaleFactor;
};
const getAnchorPosition = (index: number, totalClusters: number): { x: number; y: number } => {
  const isLeft = index % 2 === 0;
  const x = isLeft ? OUTER_MARGIN : FULL_WIDTH - OUTER_MARGIN;
  const y = (FULL_HEIGHT / Math.ceil(totalClusters / 2)) * (Math.floor(index / 2) + 1);
  return { x, y };
};
export interface DatasetViewerProps {
  data: DataSet;
  selectedPopulation: string | null;
  onSelectPopulation: (population: string | null) => void;
  onDownload: () => void;
}
export const DatasetViewer: React.FC<DatasetViewerProps> = ({
  data,
  selectedPopulation,
  onSelectPopulation,
  onDownload,
}) => {
  const [popTransform, setPopTransform] = useState<Record<string, string>>({});
  const [pathScale, setPathScale] = useState<Record<string, number>>({});
  const [umapXRange, setUmapXRange] = useState<[number, number]>([0, 0]);
  const [umapYRange, setUmapYRange] = useState<[number, number]>([0, 0]);
  const [svgPositions, setSvgPositions] = useState<Record<string, { x: number, y: number }>>({});
  useEffect(() => {
    const umapClusteringBorders = data.plot_data.umap_clustering_borders;
    const umap1Values = umapClusteringBorders.data.map(point => point.umap_1);
    const umap2Values = umapClusteringBorders.data.map(point => point.umap_2);
    const umapXRangeCalculated: [number, number] = [Math.min(...umap1Values), Math.max(...umap1Values)];
    const umapYRangeCalculated: [number, number] = [Math.min(...umap2Values), Math.max(...umap2Values)];
    setUmapXRange(umapXRangeCalculated);
    setUmapYRange(umapYRangeCalculated);
    const initialSvgPositions: Record<string, { x: number, y: number }> = {};
    data.plot_data.clustering_centers.data.forEach(cluster => {
      const clusterX = translateUMAPToSVG(cluster.umap_1, umapXRangeCalculated[0], umapXRangeCalculated[1], VIEWBOX_WIDTH);
      const clusterY = translateUMAPToSVG(cluster.umap_2, umapYRangeCalculated[0], umapYRangeCalculated[1], VIEWBOX_HEIGHT);
      initialSvgPositions[cluster.clustering] = { x: clusterX, y: clusterY };
    });
    setSvgPositions(initialSvgPositions);
  }, [data]);
  const handlePopulationClick = (population: string | null) => {
    if (!population) return;
    const totalClusters = Object.keys(groupedPoints).length;
    const newTransforms: Record<string, string> = {};
    const newScales: Record<string, number> = {};
    Object.keys(groupedPoints).forEach((clusterKey, index) => {
      const clusterPoints = groupedPoints[clusterKey];
      const initialBounds = getClusterBounds(clusterPoints);
      const scalingFactor = TARGET_CLUSTER_WIDTH / (initialBounds.maxX - initialBounds.minX);
      newScales[clusterKey] = scalingFactor;
      const originalCenter = svgPositions[clusterKey];
      if (!originalCenter) return;
      const anchorPosition = getAnchorPosition(index, totalClusters);
      const transform = `translate(${anchorPosition.x}, ${anchorPosition.y})`;
      newTransforms[clusterKey] = transform;
    });
    setPopTransform(newTransforms);
    setPathScale(newScales);
    onSelectPopulation(population);
  };
  const handleClose = () => {
    onSelectPopulation(null);
    setPopTransform({});
    setPathScale({});
  };
  const groupedPoints: Record<string, Record<string, DataPoint[]>> = {};

  if (svgPositions && Object.keys(svgPositions).length > 0) {
    data.plot_data.umap_clustering_borders.data.forEach(point => {
      if (hasLinks(data.data.clusters[point.clustering])) {
        if (!groupedPoints[point.clustering]) {
          groupedPoints[point.clustering] = {};
        }
        if (!groupedPoints[point.clustering][point.group]) {
          groupedPoints[point.clustering][point.group] = [];
        }

        groupedPoints[point.clustering][point.group].push(point);
      }

    });
    Object.keys(groupedPoints).forEach(clustering => {
      const centroid = svgPositions[clustering];
      Object.keys(groupedPoints[clustering]).forEach(group => {
        groupedPoints[clustering][group] = groupedPoints[clustering][group].map(point => ({
          ...point,
          umap_1: translateUMAPToSVG(point.umap_1, umapXRange[0], umapXRange[1], VIEWBOX_WIDTH) - centroid.x,
          umap_2: translateUMAPToSVG(point.umap_2, umapYRange[0], umapYRange[1], VIEWBOX_HEIGHT) - centroid.y,
        }));
      });
    });
  }
  const getPathData = (points: DataPoint[]): string => {
    const pathData = points.map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      const x = point.umap_1;
      const y = point.umap_2;
      return `${command} ${x},${y}`;
    }).join(' ');
    return `${pathData} Z`;
  };
  const getClusterBounds = (clusterPoints: Record<string, DataPoint[]>): { minX: number, minY: number, maxX: number, maxY: number } => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    Object.values(clusterPoints).flat().forEach(point => {
      const x = point.umap_1;
      const y = point.umap_2;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
    return { minX, minY, maxX, maxY };
  };
  return (
    <div className="relative w-full h-screen overflow-hidden p-8 flex">
      <div className="absolute inset-0"></div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground text-center">Explore Our Data</h1>
        <p className="text-muted-foreground text-center mt-2 text-lg">Click on any cluster to discover more</p>
      </div>
      <div className="relative w-full h-screen overflow-hidden p-8 flex">
        {/* UMAP SVG */}
        <div className="flex-1 relative">
          <svg
            viewBox={`0 0 ${FULL_WIDTH} ${FULL_HEIGHT}`}
            className="w-full h-full max-w-none"
            style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}
          >
            {data && svgPositions && Object.keys(svgPositions).length > 0 &&
              Object.keys(groupedPoints).map(clusterKey => {
                const cluster = data.data.clusters[clusterKey];
                const initialPosition = svgPositions[clusterKey];
                const initialTransform = initialPosition
                  ? `translate(${initialPosition.x}, ${initialPosition.y}) scale(0.9)`
                  : '';
                const clusterColor = cluster.color || '#AAAAAA';
                const fillColor = selectedPopulation === clusterKey ? cluster.softenColor(50) : clusterColor;
                const bounds = svgPositions[clusterKey];
                const rectHeight = FULL_HEIGHT /
                  Math.ceil(Object.keys(data.data.clusters).length / 2);
                return (
                  <g
                    key={clusterKey}
                    className={`cluster ${cluster.name}`}
                    transform={`${popTransform[clusterKey] || initialTransform}`}
                    onClick={() => handlePopulationClick(clusterKey)}
                    style={{ transition: 'transform 0.5s' }}
                  >
                    {selectedPopulation === clusterKey && bounds && (
                      <rect
                        x={-FIXED_RECT_WIDTH / 2}
                        y={-rectHeight / 2}
                        width={FIXED_RECT_WIDTH}
                        height={rectHeight}
                        fill={fillColor}
                        opacity="0.3"
                      />
                    )}
                    {Object.keys(groupedPoints[clusterKey]).map(group => (
                      <path
                        key={`${clusterKey}-${group}`}
                        d={getPathData(groupedPoints[clusterKey][group])}
                        transform={`scale(${pathScale[clusterKey] || 1})`}
                        fill={fillColor}
                        stroke="none"
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                    {initialPosition && (
                      <text
                        x={0}
                        y={6}
                        textAnchor="middle"
                        fill="black"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {data.data.clusters[clusterKey].display_name}
                      </text>
                    )}
                  </g>
                );
              })}
          </svg>
          {/* Selected cluster data popup */}
          {selectedPopulation && data && svgPositions && Object.keys(svgPositions).length > 0 && (
            <PopulationCard
              population={data.data.clusters[selectedPopulation]}
              onClose={handleClose}
              onDownload={onDownload}
              style_extra={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            />
          )}
        </div>
      </div>
      {/* Right side: Whole dataset info */}
      {!selectedPopulation && data && svgPositions && Object.keys(svgPositions).length > 0 && (
        <div
          style={{
            width: '30%',
            height: '100%',
            overflowY: 'auto',
            paddingLeft: '1rem',
            borderLeft: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        >
          <PopulationCard
            population={data.data}
            onClose={() => { }}
            style_extra={{ position: 'static' }}
            layout="inline"
            onDownload={onDownload}
          />
        </div>
      )}
    </div>
  );
};
export default DatasetViewer;