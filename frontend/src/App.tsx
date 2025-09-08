import { Card } from "./components/Card";
import { Container } from "./components/Container";
import { Menu } from "./components/Menu";
import { ThemeProvider } from "./components/ThemeProvider";
import { Footer } from "./components/Footer";
import { LeftBar } from "./components/LeftBar";
import questions from "./questions.js";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="storaged-theme">
      <Menu />
      <LeftBar />
      <Container className="h-[90vh] w-[] mt-5 border-1 overflow-auto">
        <div className="flex flex-wrap gap-10 justify-center bg-scroll">
          {questions.map((q, index) => (
            <Card key={index}>
              {q.title}
              <div>{q.description}</div>
              <div>
                {q.options.map((option, i) => (
                  <ul>
                    <li>{option}</li>
                  </ul>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Container>

      <Container className="text-center">
        <Footer />
      </Container>
    </ThemeProvider>
  );
}

export default App;
