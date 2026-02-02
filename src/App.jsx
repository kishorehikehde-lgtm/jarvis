import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Gate from "./pages/Gate";
import Jarvis from "./pages/Jarvis";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to gate */}
        <Route path="/" element={<Navigate to="/gate" replace />} />

        {/* Gate page */}
        <Route path="/gate" element={<Gate />} />

        {/* Jarvis page */}
        <Route path="/jarvis" element={<Jarvis />} />
      </Routes>
    </BrowserRouter>
  );
}
