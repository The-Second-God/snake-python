import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Game from "@/pages/Game";
import Tutorial from "@/pages/Tutorial";
import TutorialSection from "@/pages/TutorialSection";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/tutorial/:section" element={<TutorialSection />} />
          <Route path="/tutorial/:section/:subsection" element={<TutorialSection />} />
        </Route>
      </Routes>
    </Router>
  );
}
