import React from 'react';

interface RoadmapTooltipProps {
  children: React.ReactNode;
}

export default function RoadmapTooltip({ children }: RoadmapTooltipProps) {
  return (
    <div className="absolute z-[9999] -translate-y-[calc(100%+8px)] -translate-x-1/2 left-1/2 top-0 pointer-events-none">
      <div className="bg-gray-900/95 text-gray-200 px-3 py-1.5 rounded-md text-xs whitespace-nowrap shadow-lg">
        {children}
      </div>
      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95 mx-auto" />
    </div>
  );
}
