import { LeftBar } from "../../components/LeftBar";
import { Container } from "../../components/Container";
import { DefaultMenu } from "../../components/DefaultMenu";
import { cn } from "../../lib/utils";

type MainTemplateProps = {
  children: React.ReactNode;
  className?: string;
};

// export function MainTemplate({ children }: MainTemplateProps) {
//   return (
//     <>
//       <DefaultMenu />
//       <div className="flex min-h-screen">
//         <LeftBar />
//         <Container className="flex-1 mx-8 h-[90vh] mt-10 py-10 border-2 rounded-2xl overflow-auto flex flex-wrap gap-10 justify-center bg-scroll">
//           {children}
//         </Container>
//       </div>
//     </>
//   );
// }

export function MainTemplate({ children, className }: MainTemplateProps) {
  return (
    <div className="min-h-screen w-full grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <DefaultMenu />
      <LeftBar />
      <main className={cn("col-span-5", className)}>
        <div className="w-full grid grid-cols-[auto_1fr] grid-rows-[90vh]">
          <div className="col-span-full row-span-full ">{children}</div>
        </div>
      </main>
    </div>
  );
}
