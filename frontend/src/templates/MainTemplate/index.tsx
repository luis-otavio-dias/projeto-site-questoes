import { SideBar } from "../../components/SideBar";
import { DefaultMenu } from "../../components/DefaultMenu";
import { cn } from "../../lib/utils";
import { UploadModal } from "../../components/UploadModal";
import { useState } from "react";

type MainTemplateProps = {
  children: React.ReactNode;
  className?: string;
};

export function MainTemplate({ children, className }: MainTemplateProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex bg-background">
      <SideBar onImportarProva={() => setIsUploadModalOpen(true)} />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DefaultMenu />
        <main className={cn("flex-1", className)}>{children}</main>
      </div>
    </div>
  );
}
