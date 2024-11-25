import { Remarkable } from 'remarkable';

interface RoadmapTooltipProps {
  title?: string;
  description: string;
  moreInfo?: string;
  target?: string;
}

const md = new Remarkable();

export default function RoadmapTooltip({
  title,
  description,
  target,
  moreInfo,
}: RoadmapTooltipProps) {
  const renderedDescription = md.render(description);

  return (
    <div className="absolute z-[10000] -translate-y-[calc(100%+8px)] -translate-x-1/2 left-1/2 top-0 pointer-events-none">
      <div
        className="bg-forest font-sans text-salt text-xs p-4 rounded-md text-sm shadow-lg"
        style={{ width: '500px' }} // Set the width directly
      >
        <p className="mb-2 font-bold">{title}</p>
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: renderedDescription }}
        />
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
