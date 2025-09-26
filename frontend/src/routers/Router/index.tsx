import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "../../pages/Home";
import { Question } from "../../pages/Question";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questions/:id" element={<Question />} />
      </Routes>
    </BrowserRouter>
  );
}
