import {
  HistoryIcon,
  HeartIcon,
  ChartColumn,
  LucidePlus,
  Calendar,
  LucidePuzzle,
  NotebookPen,
} from "lucide-react";
import { SideBarSection } from "../SideBarSection";
import { SideBarItem } from "../SideBarItem";
import { SideBarUserItem } from "../SideBarUserItem";

type SideBarProps = {
  onOpenUploadModal?: () => void;
};

export function SideBar({ onOpenUploadModal }: SideBarProps) {
  return (
    <div className="max-h-screen w-75 border-r-2 grid grid-rows-[auto_auto_auto_auto_1fr] gap-4 content-start py-4">
      <SideBarSection title="Meus Estudos">
        <SideBarItem
          icon={LucidePlus}
          text="Adicionar"
          onClick={onOpenUploadModal}
        />
        <SideBarItem icon={ChartColumn} to="#" text="Estatísticas" />
        <SideBarItem icon={HeartIcon} to="#" text="Favoritos" />
        <SideBarItem icon={HistoryIcon} to="#" text="Histórico" />
      </SideBarSection>

      <hr className="border-1" />

      <SideBarSection title="Filtrar por">
        <SideBarItem icon={LucidePuzzle} to="#" text="Matéria" />
        <SideBarItem icon={Calendar} to="#" text="Ano" />
        <SideBarItem icon={NotebookPen} to="#" text="Prova" />
      </SideBarSection>

      <div />

      <div />

      <hr className="border-1" />

      <SideBarSection>
        <SideBarUserItem />
      </SideBarSection>
    </div>
  );
}
