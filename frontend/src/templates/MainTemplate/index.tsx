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
    <div className="min-h-screen w-full grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <DefaultMenu />
      <SideBar onOpenUploadModal={() => setIsUploadModalOpen(true)} />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <main className={cn("col-span-5", className)}>
        <div className="w-full grid grid-cols-[auto_1fr] grid-rows-[90vh]">
          <div className="col-span-full row-span-full ">{children}</div>
        </div>
      </main>
    </div>
  );
}
