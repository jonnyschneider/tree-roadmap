
interface RoadmapTooltipProps {
  summary: string;
  focus: string[];
  moreInfo?: string;
}

export default function RoadmapTooltip({ summary, focus, moreInfo }: RoadmapTooltipProps) {
  return (
    <div className="absolute z-[10000] -translate-y-[calc(100%+8px)] -translate-x-1/2 left-1/2 top-0 pointer-events-none">
      <div className="bg-gray-900/95 text-gray-200 px-4 py-2 rounded-md text-sm shadow-lg" style={{ width: '550px', whiteSpace: 'normal', fontFamily: 'Arial, sans-serif', lineHeight: '1.5', border: '1px solid white' }}>
        <h1 className="text-lg font-bold mb-2">Core Value</h1>
        <p className="mb-2">{summary}</p>
        <ul className="list-disc pl-5 space-y-1">
          {focus.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        {moreInfo && (
          <a href={moreInfo} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline mt-2 block">
            More Info
          </a>
        )}
      </div>
      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95 mx-auto" />
    </div>
  );
}
