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

export function SideBar() {
  return (
    <div className="max-h-screen w-75 border-r-2 grid grid-rows-[auto_auto_auto_auto_1fr] gap-4 content-start py-4">
      <SideBarSection title="Meus Estudos">
        <SideBarItem icon={LucidePlus} to="/upload_file" text="Adicionar" />
        <SideBarItem
          icon={ChartColumn}
          to="/estatisticas"
          text="Estatísticas"
        />
        <SideBarItem icon={HeartIcon} to="/favoritos" text="Favoritos" />
        <SideBarItem icon={HistoryIcon} to="/historico" text="Histórico" />
      </SideBarSection>

      <hr className="border-1" />

      <SideBarSection title="Filtrar por">
        <SideBarItem icon={LucidePuzzle} to="/filtro/materia" text="Matéria" />
        <SideBarItem icon={Calendar} to="/filtro/ano" text="Ano" />
        <SideBarItem icon={NotebookPen} to="/filtro/prova" text="Prova" />
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
