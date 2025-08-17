import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ChatbotRegister from "./ChatbotRegister";
import ChatbotExplore from "./ChatbotExplore";
import ChatbotDetail from "./ChatbotDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<ChatbotRegister />} />
        <Route path="/explore" element={<ChatbotExplore />} />
        <Route path="/chatbot/:id" element={<ChatbotDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
