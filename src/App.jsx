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
import Admin from "./components/Admin";
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
import { validateContestParams } from "./config/contestConfig";

// ═══════════════════════════════════════════════════════════════
//  PRIVATE ROUTE — multi-layer auth guard
// ═══════════════════════════════════════════════════════════════
function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function verify() {
      const validated = validateContestParams(location.search);
      const search = validated.queryString;
      if (!isLoggedIn()) {
        clearSession();
        navigate(`/login${search}`, { replace: true });
        return;
      }
      if (isSessionExpired()) {
        clearSession();
        navigate(`/login${search}`, { replace: true, state: { reason: "session_expired" } });
        return;
      }
      if (isIdleExpired()) {
        clearSession();
        navigate(`/login${search}`, { replace: true, state: { reason: "idle_timeout" } });
        return;
      }
      // Fingerprint check
      const storedFp = sessionStorage.getItem(SESSION_FP_KEY);
      const currentFp = await buildFingerprint();
      if (storedFp && storedFp !== currentFp) {
        clearSession();
        navigate(`/login${search}`, {
          replace: true,
          state: { reason: "fingerprint_mismatch" },
        });
        return;
      }
      touchActivity();
    }
    verify();
  }, [location.pathname, location.search, navigate]);

  // Synchronous guard — block render and synchronously redirect if unauthenticated
  if (!isLoggedIn() || isSessionExpired() || isIdleExpired()) {
    const validated = validateContestParams(location.search);
    return <Navigate to={`/login${validated.queryString}`} replace />;
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

    const validated = validateContestParams(location.search);
    window.history.replaceState({ historyLock: true }, "", `/arena${validated.queryString}`);

    const onPopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === "/arena") {
        return;
      }
      window.history.go(1);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isArena, location.search, navigate]);

  useEffect(() => {
    if (isArena && !isFullyAuthenticated()) {
      clearSession();
      const validated = validateContestParams(location.search);
      navigate(`/login${validated.queryString}`, { replace: true });
    }
  }, [isArena, location.search, navigate]);

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
        const validated = validateContestParams(window.location.search);
        navigate(`/login${validated.queryString}`, { replace: true, state: { reason: "idle_timeout" } });
        return;
      }
      touchActivity();
    };
    const poll = setInterval(() => {
      if (isLoggedIn() && isIdleExpired()) {
        clearSession();
        const validated = validateContestParams(window.location.search);
        navigate(`/login${validated.queryString}`, { replace: true, state: { reason: "idle_timeout" } });
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
          const validated = validateContestParams(window.location.search);
          navigate(`/login${validated.queryString}`, { replace: true, state: { reason: "tab_hidden" } });
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
        const validated = validateContestParams(window.location.search);
        navigate(`/login${validated.queryString}`, { replace: true, state: { reason: "tampered" } });
        return;
      }
      if (isSessionExpired() || isIdleExpired()) {
        clearSession();
        const validated = validateContestParams(window.location.search);
        navigate(`/login${validated.queryString}`, { replace: true, state: { reason: "session_expired" } });
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

  const validatedQuery = validateContestParams(location.search).queryString;

  return (
    <>
      <HistoryLock />
      <IdleWatcher />
      <VisibilityGuard />
      <StorageGuard />
      <Routes>
        {/* Public Login Route — supports /login?round=1, /login?round=2&phase=1, etc. */}
        <Route
          path="/login"
          element={
            authed ? (
              <Navigate to={`/arena${validatedQuery}`} replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Root Redirect to /login preserving query parameters */}
        <Route
          path="/"
          element={
            authed ? (
              <Navigate to={`/arena${validatedQuery}`} replace />
            ) : (
              <Navigate to={`/login${validatedQuery}`} replace />
            )
          }
        />

        {/* Protected Arena — /arena?round=1, /arena?round=2&phase=1, etc. */}
        <Route
          path="/arena"
          element={
            <PrivateRoute>
              <Scene />
            </PrivateRoute>
          }
        />

        {/* Admin Stage Control Panel */}
        <Route path="/admin" element={<Admin />} />

        {/* Catch-all — redirect to /login with preserved query */}
        <Route path="*" element={<Navigate to={`/login${validatedQuery}`} replace />} />
      </Routes>
    </>
  );
}