import { ThemeProvider } from "./components/ThemeProvider";
import { QuestionContextProvider } from "./providers/Question/QuestionProvider";
import { Router } from "./routers/Router";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="storaged-theme">
      <QuestionContextProvider>
        <Router />
      </QuestionContextProvider>
    </ThemeProvider>
  );
}

export default App;
