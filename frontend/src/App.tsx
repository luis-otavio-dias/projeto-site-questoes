import { Card } from "./components/Card";
import { Container } from "./components/Container";
import { Menu } from "./components/Menu";
import { ThemeProvider } from "./components/ThemeProvider";
import questions from "./questions.js";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="storaged-theme">
      <Menu />
      <Container className="mt-5 border-1">
        <div className="flex flex-wrap gap-8">
          {questions.map((q, index) => (
            <Card key={index}>
              {q.title}
              <p>{q.description}</p>
              <p>
                {q.options.map((option, i) => (
                  <ul>
                    <li>{option}</li>
                  </ul>
                ))}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;
