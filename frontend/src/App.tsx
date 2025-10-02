import { ThemeProvider } from "./components/ThemeProvider";
import { QuestionContextProvider } from "./providers/Question/QuestionProvider";
import { UserContextProvider } from "./providers/User/UserProvider";
import { Router } from "./routers/Router";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="storaged-theme">
      <UserContextProvider>
        <QuestionContextProvider>
          <Router />
        </QuestionContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  );
}

export default App;
