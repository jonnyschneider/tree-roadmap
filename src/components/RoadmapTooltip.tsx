//import { Target } from "lucide-react";

interface RoadmapTooltipProps {
  title?: string;
  description: string;
  moreInfo?: string;
  target?: string;
}

export default function RoadmapTooltip({
  title,
  target,
  moreInfo,
}: RoadmapTooltipProps) {
  return (
    <div className="absolute z-[10000] -translate-y-[calc(100%+8px)] -translate-x-1/2 left-1/2 top-0 pointer-events-none">
      <div
        className="bg-gray-900/95 text-gray-200 px-4 py-2 rounded-md text-sm shadow-lg"
        style={{
          width: '250',
          whiteSpace: 'normal',
          fontFamily: 'mono',
          lineHeight: '1.5',
          border: '1px solid white',

        }}
      >
        <p className="mb-2">{title}</p>
        <ul className="list-disc pl-5 space-y-1">{target}</ul>
        {moreInfo && (
          <a
            href={moreInfo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline mt-2 block"
          >
            More Info
          </a>
        )}
      </div>
      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95 mx-auto" />
    </div>
  );
}
