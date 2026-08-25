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
import { validateContestParams } from "./config/contestConfig";

// ═══════════════════════════════════════════════════════════════
//  Helper — redirect to /login preserving all contest query params
// ═══════════════════════════════════════════════════════════════
function ToLogin() {
  const location = useLocation();
  const { queryString } = validateContestParams(location.search);
  return <Navigate to={`/login${queryString}`} replace />;
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

        {/* Root → Login with query params */}
        <Route path="/" element={<ToLogin />} />

        {/* Admin Stage Control Panel */}
        <Route path="/admin" element={<Admin />} />

        {/* Public Leaderboard & Results */}
        <Route path="/result"      element={<LeaderboardHub />} />
        <Route path="/results"     element={<LeaderboardHub />} />
        <Route path="/leaderboard" element={<LeaderboardHub />} />

        {/* Catch-all → Login with query params */}
        <Route path="*" element={<ToLogin />} />
      </Routes>
    </BrowserRouter>
  );
}