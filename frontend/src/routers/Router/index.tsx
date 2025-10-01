import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "../../pages/Home";
import { Question } from "../../pages/Question";
import { Login } from "../../pages/Login";
import { Register } from "../../pages/Register";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/questions/:id" element={<Question />} />
      </Routes>
    </BrowserRouter>
  );
}
