import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Scene from "./scene/Scene";
import Admin from "./components/Admin";
import LeaderboardHub from "./leaderboard/LeaderboardHub";

// ═══════════════════════════════════════════════════════════════
//  APP ROUTER — Login removed; arena is public
// ═══════════════════════════════════════════════════════════════
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Arena — now public, no auth required */}
        <Route path="/arena" element={<Scene />} />

        {/* Root → Arena */}
        <Route path="/" element={<Navigate to="/arena" replace />} />

        {/* Old login bookmarks → Arena */}
        <Route path="/login" element={<Navigate to="/arena" replace />} />

        {/* Admin Stage Control Panel */}
        <Route path="/admin" element={<Admin />} />

        {/* Public Leaderboard & Results Routes */}
        <Route path="/result" element={<LeaderboardHub />} />
        <Route path="/results" element={<LeaderboardHub />} />
        <Route path="/leaderboard" element={<LeaderboardHub />} />

        {/* Catch-all → Arena */}
        <Route path="*" element={<Navigate to="/arena" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
