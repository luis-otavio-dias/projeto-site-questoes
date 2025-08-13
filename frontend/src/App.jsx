import { useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QuestionPage from "./pages/QuestionPage";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/questions/:id" element={<QuestionPage />} />
          </Routes>
        </Container>
      </main>
    </Router>
  );
}

export default App;
