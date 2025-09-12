import { Card } from "./components/Card";
import { Container } from "./components/Container";
import { Menu } from "./components/Menu";
import { ThemeProvider } from "./components/ThemeProvider";
import { LeftBar } from "./components/LeftBar";
import questions from "./questions.js";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="storaged-theme">
      <Menu />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <LeftBar />
          <div className="flex-1">
            <Container className="h-[90vh] mt-10 border-2 rounded-2xl overflow-auto flex-1">
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
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
