import { ThemeProvider } from "./components/ThemeProvider";
import { Router } from "./routers/Router";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="storaged-theme">
      <Router />
    </ThemeProvider>
  );
}

export default App;
