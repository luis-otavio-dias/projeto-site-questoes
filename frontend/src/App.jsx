import { useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QuestionPage from "./pages/QuestionPage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="py-3">
          <Container>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/questions/:id" element={<QuestionPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
