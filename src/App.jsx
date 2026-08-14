import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Login from "./components/Login";
import Scene from "./scene/Scene";
import {
  isLoggedIn,
  isSessionExpired,
  isIdleExpired,
  isFullyAuthenticated,
  clearSession,
  touchActivity,
  buildFingerprint,
  SESSION_KEY,
  SESSION_TS_KEY,
  SESSION_FP_KEY,
  IDLE_TS_KEY,
} from "./utils/sessionSecurity";

// ═══════════════════════════════════════════════════════════════
//  PRIVATE ROUTE — multi-layer auth guard
// ═══════════════════════════════════════════════════════════════
function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function verify() {
      if (!isLoggedIn()) {
        clearSession();
        navigate("/", { replace: true });
        return;
      }
      if (isSessionExpired()) {
        clearSession();
        navigate("/", { replace: true, state: { reason: "session_expired" } });
        return;
      }
      if (isIdleExpired()) {
        clearSession();
        navigate("/", { replace: true, state: { reason: "idle_timeout" } });
        return;
      }
      // Fingerprint check
      const storedFp = sessionStorage.getItem(SESSION_FP_KEY);
      const currentFp = await buildFingerprint();
      if (storedFp && storedFp !== currentFp) {
        clearSession();
        navigate("/", {
          replace: true,
          state: { reason: "fingerprint_mismatch" },
        });
        return;
      }
      touchActivity();
    }
    verify();
  }, [location.pathname, navigate]);

  // Synchronous guard — block render if clearly not authenticated
  if (!isLoggedIn() || isSessionExpired() || isIdleExpired()) {
    return null;
  }
  return children;
}

// ═══════════════════════════════════════════════════════════════
//  HISTORY LOCK — blocks back/forward button auth bypass
// ═══════════════════════════════════════════════════════════════
function HistoryLock() {
  const navigate = useNavigate();
  const location = useLocation();
  const isArena = location.pathname === "/arena";

  useEffect(() => {
    if (!isArena) return;

    window.history.replaceState({ historyLock: true }, "", "/arena");

    const onPopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === "/arena") {
        return;
      }
      window.history.go(1);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isArena, navigate]);

  useEffect(() => {
    if (isArena && !isFullyAuthenticated()) {
      clearSession();
      navigate("/", { replace: true });
    }
  }, [isArena, navigate]);

  return null;
}

// ═══════════════════════════════════════════════════════════════
//  IDLE WATCHER — resets idle timer on any user interaction
// ═══════════════════════════════════════════════════════════════
function IdleWatcher() {
  const navigate = useNavigate();

  useEffect(() => {
    const EVENTS = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];
    const onActivity = () => {
      if (!isLoggedIn()) return;
      if (isIdleExpired()) {
        clearSession();
        navigate("/", { replace: true, state: { reason: "idle_timeout" } });
        return;
      }
      touchActivity();
    };
    const poll = setInterval(() => {
      if (isLoggedIn() && isIdleExpired()) {
        clearSession();
        navigate("/", { replace: true, state: { reason: "idle_timeout" } });
      }
    }, 30_000);
    EVENTS.forEach((ev) =>
      window.addEventListener(ev, onActivity, { passive: true }),
    );
    return () => {
      clearInterval(poll);
      EVENTS.forEach((ev) => window.removeEventListener(ev, onActivity));
    };
  }, [navigate]);

  return null;
}

// ═══════════════════════════════════════════════════════════════
//  VISIBILITY GUARD — logout if tab is hidden > 15 min
// ═══════════════════════════════════════════════════════════════
function VisibilityGuard() {
  const navigate = useNavigate();
  const hiddenSince = useRef(null);
  const MAX_HIDDEN = 15 * 60 * 1000;

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        hiddenSince.current = Date.now();
      } else {
        if (
          hiddenSince.current &&
          Date.now() - hiddenSince.current > MAX_HIDDEN &&
          isLoggedIn()
        ) {
          clearSession();
          navigate("/", { replace: true, state: { reason: "tab_hidden" } });
        }
        hiddenSince.current = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [navigate]);

  return null;
}

// ═══════════════════════════════════════════════════════════════
//  STORAGE GUARD — detects DevTools token tampering
// ═══════════════════════════════════════════════════════════════
function StorageGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    const poll = setInterval(() => {
      if (!isLoggedIn()) return;
      const hasTs = !!sessionStorage.getItem(SESSION_TS_KEY);
      const hasFp = !!sessionStorage.getItem(SESSION_FP_KEY);
      const hasIt = !!sessionStorage.getItem(IDLE_TS_KEY);
      if (!hasTs || !hasFp || !hasIt) {
        clearSession();
        navigate("/", { replace: true, state: { reason: "tampered" } });
        return;
      }
      if (isSessionExpired() || isIdleExpired()) {
        clearSession();
        navigate("/", { replace: true, state: { reason: "session_expired" } });
      }
    }, 5_000);
    return () => clearInterval(poll);
  }, [navigate]);

  return null;
}

// ═══════════════════════════════════════════════════════════════
//  APP ROUTER
// ═══════════════════════════════════════════════════════════════
export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

function AppInner() {
  const location = useLocation();
  const [authed, setAuthed] = useState(() => isFullyAuthenticated());
  useEffect(() => {
    setAuthed(isFullyAuthenticated());
  }, [location]);

  return (
    <>
      <HistoryLock />
      <IdleWatcher />
      <VisibilityGuard />
      <StorageGuard />
      <Routes>
        {/* Public — redirect to arena if already authenticated */}
        <Route
          path="/"
          element={authed ? <Navigate to="/arena" replace /> : <Login />}
        />

        {/* Protected Arena */}
        <Route
          path="/arena"
          element={
            <PrivateRoute>
              <Scene />
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}