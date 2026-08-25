import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Scene from "./scene/Scene";
import Admin from "./components/Admin";
import LeaderboardHub from "./leaderboard/LeaderboardHub";

// ═══════════════════════════════════════════════════════════════
//  Helper to redirect to /arena while preserving all query parameters
// ═══════════════════════════════════════════════════════════════
function RedirectToArena() {
  const location = useLocation();
  return <Navigate to={`/arena${location.search}`} replace />;
}

// ═══════════════════════════════════════════════════════════════
//  APP ROUTER — Login removed; direct redirect to arena
// ═══════════════════════════════════════════════════════════════
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Arena — direct public access */}
        <Route path="/arena" element={<Scene />} />

        {/* Root → Arena (Preserving params) */}
        <Route path="/" element={<RedirectToArena />} />

        {/* All login paths → Arena (Preserving params) */}
        <Route path="/login" element={<RedirectToArena />} />

        {/* Admin Stage Control Panel */}
        <Route path="/admin" element={<Admin />} />

        {/* Public Leaderboard & Results Routes */}
        <Route path="/result" element={<LeaderboardHub />} />
        <Route path="/results" element={<LeaderboardHub />} />
        <Route path="/leaderboard" element={<LeaderboardHub />} />

        {/* Catch-all → Arena (Preserving params) */}
        <Route path="*" element={<RedirectToArena />} />
      </Routes>
    </BrowserRouter>
  );
}