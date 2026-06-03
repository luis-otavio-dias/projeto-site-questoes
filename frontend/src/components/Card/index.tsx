interface QuestionCardProps {
  area: string;
  stem: string;
  topic: string;
  examInfo?: string;
}

export function Card({ area, stem, topic, examInfo }: QuestionCardProps) {
  return (
    <div className="relative group w-[292px] h-[224px] flex flex-col bg-card dark:bg-[#18181B] border border-border dark:border-[#27272A] dark:hover:border-[#9F9FA9] rounded-[14px] p-5 transition-colors duration-300 cursor-pointer overflow-hidden">
      {/* Hover gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #18181B 0%, #1559EF 32%)",
        }}
      />

      {/* Top row — subject badge */}
      <div className="relative z-10 flex items-center">
        <span className="bg-[rgba(43,127,255,0.1)] text-[#51A2FF] text-xs font-medium px-3 py-1 rounded-[10px]">
          {area}
        </span>
      </div>

      {/* Question text — fades to 28% on hover */}
      <div className="relative z-10 flex-1 mt-3 overflow-hidden transition-opacity duration-300 group-hover:opacity-[0.28]">
        <p className="text-sm text-card-foreground dark:text-[#D4D4D8] leading-[1.625] line-clamp-4">
          {stem}
        </p>
      </div>

      {/* Footer — fades to 44% on hover */}
      <div className="relative z-10 flex items-center justify-between mt-auto pt-2 transition-opacity duration-300 group-hover:opacity-[0.44]">
        <span className="text-xs text-muted-foreground dark:text-[#71717B] truncate mr-2">
          {topic}
        </span>
        {examInfo && (
          <span className="text-xs text-muted-foreground dark:text-[#71717B] shrink-0">
            {examInfo}
          </span>
        )}
      </div>

      {/* "Resolver Questão" decorative button — slides in on hover */}
      <div className="absolute bottom-[21px] left-1/2 -translate-x-1/2 z-20 w-[175px] h-[43px] bg-white rounded-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none">
        <span className="text-sm font-semibold text-[#2669FC]">
          Resolver Questão
        </span>
      </div>
    </div>
  );
}
