import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "../../pages/Home";
import { Test } from "../../pages/Test";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questions/:id" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}
