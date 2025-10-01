import { Container } from "../../components/Container";
import { DefaultMenu } from "../../components/DefaultMenu";

type FormContainerTemplateProps = {
  children: React.ReactNode;
};

export function FormContainerTemplate({
  children,
}: FormContainerTemplateProps) {
  return (
    <>
      <DefaultMenu />
      <div className="flex min-h-screen items-center justify-center">
        <Container className="flex-1 max-w-3xl h-[70vh] py-10 border-2 rounded-2xl overflow-auto flex flex-wrap gap-10 justify-center bg-scroll">
          {children}
        </Container>
      </div>
    </>
  );
}
