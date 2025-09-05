import { X } from 'lucide-react';

interface ContinentInfo {
  name: string;
  description: string;
  countries: number;
  population: string;
  area: string;
  highlights: string[];
}

interface ContinentDataProps {
  continent: ContinentInfo;
  onClose: () => void;
}

export const ContinentData = ({ continent, onClose }: ContinentDataProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
      <div className="info-panel max-w-md w-full animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">
            {continent.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Description */}
        <p className="text-foreground/80 text-sm mb-4 leading-relaxed">
          {continent.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-accent">
              {continent.countries}
            </div>
            <div className="text-muted-foreground text-xs">
              Countries
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-accent">
              {continent.population}
            </div>
            <div className="text-muted-foreground text-xs">
              Population
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-accent">
              {continent.area}
            </div>
            <div className="text-muted-foreground text-xs">
              Area
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Key Highlights
          </h3>
          <div className="flex flex-wrap gap-1">
            {continent.highlights.map((highlight, index) => (
              <span
                key={index}
                className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs border border-accent/30"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
