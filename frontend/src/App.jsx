import { useState } from "react";
import Index from "./pages/Index";
import Header from "./components/Header";

function App() {
  return (
    <div>
      <Header />
      <main className="py-3">
        <Index />
      </main>
    </div>
  );
}

export default App;
