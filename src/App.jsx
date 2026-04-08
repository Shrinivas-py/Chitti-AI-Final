import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar }       from './components/UI/Navbar';
import { LandingPage }  from './pages/LandingPage';
import { ChatPage }     from './pages/ChatPage';
import { ThinkingPage } from './pages/ThinkingPage';
import { OutputPage }   from './pages/OutputPage';

export default function App() {
  return (
    <div style={{ minHeight:'100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/"         element={<LandingPage  />} />
        <Route path="/chat"     element={<ChatPage     />} />
        <Route path="/thinking" element={<ThinkingPage />} />
        <Route path="/output"   element={<OutputPage   />} />
      </Routes>
    </div>
  );
}
