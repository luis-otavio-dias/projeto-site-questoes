import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "../../pages/Home";
import { Question } from "../../pages/Question";
import { Login } from "../../pages/Login";
import { Register } from "../../pages/Register";
import { Upload } from "../../pages/Upload";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/questions/:id" element={<Question />} />
        <Route path="/upload_file" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  );
}
