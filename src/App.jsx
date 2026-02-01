import { BrowserRouter, Routes, Route } from "react-router-dom";
import Gate from "./pages/Gate";
import Jarvis from "./pages/Jarvis";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gate />} />
        <Route path="/jarvis" element={<Jarvis />} />
      </Routes>
    </BrowserRouter>
  );
}
