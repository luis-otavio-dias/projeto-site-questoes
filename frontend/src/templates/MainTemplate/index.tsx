import { LeftBar } from "../../components/LeftBar";
import { Container } from "../../components/Container";
import { DefaultMenu } from "../../components/DefaultMenu";

type MainTemplateProps = {
  children: React.ReactNode;
};

export function MainTemplate({ children }: MainTemplateProps) {
  return (
    <>
      <DefaultMenu />
      <div className="flex min-h-screen">
        <LeftBar />
        <Container className="flex-1 mx-8 h-[90vh] mt-10 py-10 border-2 rounded-2xl overflow-auto flex flex-wrap gap-10 justify-center bg-scroll">
          {children}
        </Container>
      </div>
    </>
  );
}
