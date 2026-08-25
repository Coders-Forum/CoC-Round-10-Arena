import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Scene from "./scene/Scene";
import Login from "./components/Login";
import Admin from "./components/Admin";
import LeaderboardHub from "./leaderboard/LeaderboardHub";

// ═══════════════════════════════════════════════════════════════
//  Helper — redirect to /arena preserving all query params
// ═══════════════════════════════════════════════════════════════
function ToArena() {
  const location = useLocation();
  return <Navigate to={`/arena${location.search}`} replace />;
}

// ═══════════════════════════════════════════════════════════════
//  APP ROUTER
// ═══════════════════════════════════════════════════════════════
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login — required to enter the arena */}
        <Route path="/login" element={<Login />} />

        {/* Arena — 3D contest stage */}
        <Route path="/arena" element={<Scene />} />

        {/* Root → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin Stage Control Panel */}
        <Route path="/admin" element={<Admin />} />

        {/* Public Leaderboard & Results */}
        <Route path="/result"      element={<LeaderboardHub />} />
        <Route path="/results"     element={<LeaderboardHub />} />
        <Route path="/leaderboard" element={<LeaderboardHub />} />

        {/* Catch-all → Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}