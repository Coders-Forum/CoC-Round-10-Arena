/**
 * ═══════════════════════════════════════════════════════════════════
 *  CLASH OF CODERS — CENTRALIZED CONTEST CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════
 *
 *  ORGANIZER NOTICE:
 *  All external contest and challenge URLs are isolated here.
 *  To update URLs, modify ONLY this file. Do not edit Scene, Login,
 *  or Land components.
 *
 *  Canonical 25 Land Keys (matching 3D Arena):
 *  1. volcano   (Array Realm)            14. torii      (Queue Gate)
 *  2. snow      (String Sanctum)         15. castle2    (Linked List Fort)
 *  3. plant     (Hash Table Isle)        16. pagoda2    (Pattern Tower)
 *  4. island    (Math Arena)             17. barracks   (Recursion Barracks)
 *  5. coliseum  (Sorting Coliseum)       18. palace     (Backtracking Palace)
 *  6. pyramid   (Searching Pyramid)      19. shrine     (Bit Manipulation Shrine)
 *  7. castle    (DFS Fortress)           20. deadforest (Mystery Land)
 *  8. ruin      (BFS Ruins)              21. temple     (Set Sanctuary)
 *  9. mayan     (Database Temple)        22. archway    (DP Monument)
 *  10. greek    (Matrix Shrine)          23. necro      (Priority Queue Necropolis)
 *  11. pagoda   (2 Pointers Pagoda)      24. cemetery   (Prefix & Suffix Realm)
 *  12. pedestal (Sliding Window Pedestal)25. pillars    (Greedy Pillars)
 *  13. cathedral(Stack Citadel)
/**
 * Resolves the Backend API URL safely across local dev & production cloud deployments.
 */
export function getApiUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim() !== "") {
    const trimmed = envUrl.trim().replace(/\/$/, "");
    if (!import.meta.env.DEV && (trimmed.includes("localhost") || trimmed.includes("127.0.0.1"))) {
      return "";
    }
    return trimmed;
  }
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }
  return "";
}

export const CONTEST_CONFIG = {
  // ── ROUND 0 CONFIGURATION (GFG — External) ────────────────────────
  round0: {
    title: "Round 0 — Codefront (GFG)",
    buttonText: "ROUND 0 IS LIVE",
    // TODO: Replace with actual GFG contest link when organizers share it
    contestUrl: "https://practice.geeksforgeeks.org/contest/clash-of-coders-round0",
  },

  // ── ROUND 1 CONFIGURATION ──────────────────────────────────────────
  round1: {
    title: "Round 1 — Code Warfare (Online)",
    buttonText: "ENTER ROUND 1",
    lands: [
      { landId: 1,  landKey: "volcano",    landName: "Array Realm",                contestUrl: "https://www.hackerrank.com/coc-r1-1" },
      { landId: 2,  landKey: "snow",       landName: "String Sanctum",             contestUrl: "https://www.hackerrank.com/coc-r1-2" },
      { landId: 3,  landKey: "plant",      landName: "Hash Table Isle",            contestUrl: "https://www.hackerrank.com/coc-r1-3" },
      { landId: 4,  landKey: "island",     landName: "Math Arena",                 contestUrl: "https://www.hackerrank.com/coc-r1-4" },
      { landId: 5,  landKey: "coliseum",   landName: "Sorting Coliseum",           contestUrl: "https://www.hackerrank.com/coc-r1-5" },
      { landId: 6,  landKey: "pyramid",    landName: "Searching Pyramid",          contestUrl: "https://www.hackerrank.com/coc-r1-6" },
      { landId: 7,  landKey: "castle",     landName: "DFS Fortress",               contestUrl: "https://www.hackerrank.com/coc-r1-7" },
      { landId: 8,  landKey: "ruin",       landName: "BFS Ruins",                  contestUrl: "https://www.hackerrank.com/coc-r1-8" },
      { landId: 9,  landKey: "mayan",      landName: "Database Temple",            contestUrl: "https://www.hackerrank.com/coc-r1-9" },
      { landId: 10, landKey: "greek",      landName: "Matrix Shrine",              contestUrl: "https://www.hackerrank.com/coc-r1-10" },
      { landId: 11, landKey: "pagoda",     landName: "2 Pointers Pagoda",          contestUrl: "https://www.hackerrank.com/coc-r1-11" },
      { landId: 12, landKey: "pedestal",   landName: "Sliding Window Pedestal",    contestUrl: "https://www.hackerrank.com/coc-r1-12" },
      { landId: 13, landKey: "cathedral",  landName: "Stack Citadel",              contestUrl: "https://www.hackerrank.com/coc-r1-13" },
      { landId: 14, landKey: "torii",      landName: "Queue Gate",                 contestUrl: "https://www.hackerrank.com/coc-r1-14" },
      { landId: 15, landKey: "castle2",    landName: "Linked List Fort",           contestUrl: "https://www.hackerrank.com/coc-r1-15" },
      { landId: 16, landKey: "pagoda2",    landName: "Pattern Tower",              contestUrl: "https://www.hackerrank.com/coc-r1-16" },
      { landId: 17, landKey: "barracks",   landName: "Recursion Barracks",         contestUrl: "https://www.hackerrank.com/coc-r1-17" },
      { landId: 18, landKey: "palace",     landName: "Backtracking Palace",        contestUrl: "https://www.hackerrank.com/coc-r1-18" },
      { landId: 19, landKey: "shrine",     landName: "Bit Manipulation Shrine",    contestUrl: "https://www.hackerrank.com/coc-r1-19" },
      { landId: 20, landKey: "deadforest", landName: "Mystery Land",               contestUrl: "https://www.hackerrank.com/coc-r1-20" },
      { landId: 21, landKey: "temple",     landName: "Set Sanctuary",              contestUrl: "https://www.hackerrank.com/coc-r1-21" },
      { landId: 22, landKey: "archway",    landName: "DP Monument",                contestUrl: "https://www.hackerrank.com/coc-r1-22" },
      { landId: 23, landKey: "necro",      landName: "Priority Queue Necropolis",  contestUrl: "https://www.hackerrank.com/coc-r1-23" },
      { landId: 24, landKey: "cemetery",   landName: "Prefix & Suffix Realm",      contestUrl: "https://www.hackerrank.com/coc-r1-24" },
      { landId: 25, landKey: "pillars",    landName: "Greedy Pillars",             contestUrl: "https://www.hackerrank.com/coc-r1-25" },
    ],
  },

  // ── ROUND 2 CONFIGURATION ──────────────────────────────────────────
  round2: {
    // Phase 1
    phase1: {
      title: "Round 2 — Phase 1 (Offline)",
      registrationUrl: "https://www.hackerrank.com/contests/coc-r2-phase1",
      buttonText: "REGISTER FOR PHASE 1",
      enterButtonText: "ENTER PHASE 1",
      lands: [
        { landId: 1,  landKey: "volcano",    landName: "Array Realm",               challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-array1/problem" },
        { landId: 2,  landKey: "snow",       landName: "String Sanctum",            challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-string1/problem" },
        { landId: 3,  landKey: "plant",      landName: "Hash Table Isle",           challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-hashtable1/problem" },
        { landId: 4,  landKey: "island",     landName: "Math Arena",                challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-math1/problem" },
        { landId: 5,  landKey: "coliseum",   landName: "Sorting Coliseum",          challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-sorting1/problem" },
        { landId: 6,  landKey: "pyramid",    landName: "Searching Pyramid",         challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-searching1/problem" },
        { landId: 7,  landKey: "castle",     landName: "DFS Fortress",              challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-dfs1/problem" },
        { landId: 8,  landKey: "ruin",       landName: "BFS Ruins",                 challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-bfs1/problem" },
        { landId: 9,  landKey: "mayan",      landName: "Database Temple",           challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/print-prime-numbers/problem" },
        { landId: 10, landKey: "greek",      landName: "Matrix Shrine",             challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-matrix1/problem" },
        { landId: 11, landKey: "pagoda",     landName: "2 Pointers Pagoda",         challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-twopointers1/problem" },
        { landId: 12, landKey: "pedestal",   landName: "Sliding Window Pedestal",   challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-slidingwindow1/problem" },
        { landId: 13, landKey: "cathedral",  landName: "Stack Citadel",             challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-stack1/problem" },
        { landId: 14, landKey: "torii",      landName: "Queue Gate",                challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-queue1/problem" },
        { landId: 15, landKey: "castle2",    landName: "Linked List Fort",          challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/print-the-elements-of-a-linked-list-in-reverse/problem" },
        { landId: 16, landKey: "pagoda2",    landName: "Pattern Tower",             challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-pattern1/problem" },
        { landId: 17, landKey: "barracks",   landName: "Recursion Barracks",        challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-recursion1/problem" },
        { landId: 18, landKey: "palace",     landName: "Backtracking Palace",       challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-backtracking1/problem" },
        { landId: 19, landKey: "shrine",     landName: "Bit Manipulation Shrine",   challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-bits1/problem" },
        { landId: 20, landKey: "deadforest", landName: "Mystery Land",              challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-mystery1/problem" },
        { landId: 21, landKey: "temple",     landName: "Set Sanctuary",             challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-set1/problem" },
        { landId: 22, landKey: "archway",    landName: "DP Monument",               challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-dynamicprogramming1/problem" },
        { landId: 23, landKey: "necro",      landName: "Priority Queue Necropolis", challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-pq1/problem" },
        { landId: 24, landKey: "cemetery",   landName: "Prefix & Suffix Realm",     challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-prefix1/problem" },
        { landId: 25, landKey: "pillars",    landName: "Greedy Pillars",            challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase1/challenges/coc-r2-greedy1/problem" },
      ],
    },

    // Phase 2
    phase2: {
      title: "Round 2 — Phase 2 (Offline)",
      registrationUrl: "https://www.hackerrank.com/contests/coc-round2-phase2",
      buttonText: "REGISTER FOR PHASE 2",
      enterButtonText: "ENTER PHASE 2",
      lands: [
        { landId: 1,  landKey: "volcano",    landName: "Array Realm",               challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-array2/problem" },
        { landId: 2,  landKey: "snow",       landName: "String Sanctum",            challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-string2/problem" },
        { landId: 3,  landKey: "plant",      landName: "Hash Table Isle",           challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-hashtable2/problem" },
        { landId: 4,  landKey: "island",     landName: "Math Arena",                challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-math2/problem" },
        { landId: 5,  landKey: "coliseum",   landName: "Sorting Coliseum",          challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-sorting2/problem" },
        { landId: 6,  landKey: "pyramid",    landName: "Searching Pyramid",         challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-searching2/problem" },
        { landId: 7,  landKey: "castle",     landName: "DFS Fortress",              challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-dfs2/problem" },
        { landId: 8,  landKey: "ruin",       landName: "BFS Ruins",                 challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-bfs2/problem" },
        { landId: 9,  landKey: "mayan",      landName: "Database Temple",           challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/symmetric-pairs/problem" },
        { landId: 10, landKey: "greek",      landName: "Matrix Shrine",             challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-matrix2/problem" },
        { landId: 11, landKey: "pagoda",     landName: "2 Pointers Pagoda",         challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-twopointers2/problem" },
        { landId: 12, landKey: "pedestal",   landName: "Sliding Window Pedestal",   challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-slidingwindow2/problem" },
        { landId: 13, landKey: "cathedral",  landName: "Stack Citadel",             challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-stack2/problem" },
        { landId: 14, landKey: "torii",      landName: "Queue Gate",                challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-queue2/problem" },
        { landId: 15, landKey: "castle2",    landName: "Linked List Fort",          challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/find-the-merge-point-of-two-joined-linked-lists/problem" },
        { landId: 16, landKey: "pagoda2",    landName: "Pattern Tower",             challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-pattern2/problem" },
        { landId: 17, landKey: "barracks",   landName: "Recursion Barracks",        challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-recursion2/problem" },
        { landId: 18, landKey: "palace",     landName: "Backtracking Palace",       challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-backtracking2/problem" },
        { landId: 19, landKey: "shrine",     landName: "Bit Manipulation Shrine",   challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-bits2/problem" },
        { landId: 20, landKey: "deadforest", landName: "Mystery Land",              challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-mystery2/problem" },
        { landId: 21, landKey: "temple",     landName: "Set Sanctuary",             challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-set2/problem" },
        { landId: 22, landKey: "archway",    landName: "DP Monument",               challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-dynamicprogramming2/problem" },
        { landId: 23, landKey: "necro",      landName: "Priority Queue Necropolis", challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-pq2/problem" },
        { landId: 24, landKey: "cemetery",   landName: "Prefix & Suffix Realm",     challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-prefix2/problem" },
        { landId: 25, landKey: "pillars",    landName: "Greedy Pillars",            challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase2/challenges/coc-r2-greedy2/problem" },
      ],
    },

    // Phase 3
    phase3: {
      title: "Round 2 — Phase 3 (Offline)",
      registrationUrl: "https://www.hackerrank.com/contests/coc-round2-phase3",
      buttonText: "REGISTER FOR PHASE 3",
      enterButtonText: "ENTER PHASE 3",
      lands: [
        { landId: 1,  landKey: "volcano",    landName: "Array Realm",               challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-array3/problem" },
        { landId: 2,  landKey: "snow",       landName: "String Sanctum",            challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-string3/problem" },
        { landId: 3,  landKey: "plant",      landName: "Hash Table Isle",           challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-hashtable3/problem" },
        { landId: 4,  landKey: "island",     landName: "Math Arena",                challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-math3/problem" },
        { landId: 5,  landKey: "coliseum",   landName: "Sorting Coliseum",          challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-sorting3/problem" },
        { landId: 6,  landKey: "pyramid",    landName: "Searching Pyramid",         challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-searching3/problem" },
        { landId: 7,  landKey: "castle",     landName: "DFS Fortress",              challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-dfs3/problem" },
        { landId: 8,  landKey: "ruin",       landName: "BFS Ruins",                 challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-bfs3/problem" },
        { landId: 9,  landKey: "mayan",      landName: "Database Temple",           challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/occupations/problem" },
        { landId: 10, landKey: "greek",      landName: "Matrix Shrine",             challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-matrix3/problem" },
        { landId: 11, landKey: "pagoda",     landName: "2 Pointers Pagoda",         challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-twopointers3/problem" },
        { landId: 12, landKey: "pedestal",   landName: "Sliding Window Pedestal",   challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-slidingwindow3/problem" },
        { landId: 13, landKey: "cathedral",  landName: "Stack Citadel",             challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-stack3/problem" },
        { landId: 14, landKey: "torii",      landName: "Queue Gate",                challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-queue3/problem" },
        { landId: 15, landKey: "castle2",    landName: "Linked List Fort",          challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/merge-two-sorted-linked-lists/problem" },
        { landId: 16, landKey: "pagoda2",    landName: "Pattern Tower",             challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-pattern3/problem" },
        { landId: 17, landKey: "barracks",   landName: "Recursion Barracks",        challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-recursion3/problem" },
        { landId: 18, landKey: "palace",     landName: "Backtracking Palace",       challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-backtracking3/problem" },
        { landId: 19, landKey: "shrine",     landName: "Bit Manipulation Shrine",   challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-bits3/problem" },
        { landId: 20, landKey: "deadforest", landName: "Mystery Land",              challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-mystery3/problem" },
        { landId: 21, landKey: "temple",     landName: "Set Sanctuary",             challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-set3/problem" },
        { landId: 22, landKey: "archway",    landName: "DP Monument",               challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-dynamicprogramming3/problem" },
        { landId: 23, landKey: "necro",      landName: "Priority Queue Necropolis", challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-pq3/problem" },
        { landId: 24, landKey: "cemetery",   landName: "Prefix & Suffix Realm",     challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-prefix3/problem" },
        { landId: 25, landKey: "pillars",    landName: "Greedy Pillars",            challengeUrl: "https://www.hackerrank.com/contests/coc-r2-phase3/challenges/coc-r2-greedy3/problem" },
      ],
    },
  },
};

/**
 * Validates and normalizes the supported contest query combinations:
 * - round=0             → Round 0 (GFG)
 * - round=1             → Round 1
 * - round=2&phase=1     → Round 2 Phase 1
 * - round=2&phase=2     → Round 2 Phase 2
 * - round=2&phase=3     → Round 2 Phase 3
 *
 * Invalid combinations fail safely to default Round 1 (?round=1).
 *
 * @param {string|URLSearchParams|object} searchOrParams
 * @returns {{ round: string, phase: string|null, queryString: string, isValid: boolean }}
 */
export function validateContestParams(searchOrParams) {
  let params;
  if (typeof searchOrParams === "string") {
    const cleanSearch = searchOrParams.startsWith("?")
      ? searchOrParams.slice(1)
      : searchOrParams;
    params = new URLSearchParams(cleanSearch);
  } else if (searchOrParams instanceof URLSearchParams) {
    params = searchOrParams;
  } else if (searchOrParams && typeof searchOrParams === "object") {
    params = new URLSearchParams(searchOrParams);
  } else {
    params = new URLSearchParams("");
  }

  const round = params.get("round");
  const phase = params.get("phase");

  if (round === "0") return { round: "0", phase: null, queryString: "?round=0",          isValid: true };
  if (round === "1") return { round: "1", phase: null, queryString: "?round=1",          isValid: true };
  if (round === "2" && phase === "1") return { round: "2", phase: "1", queryString: "?round=2&phase=1", isValid: true };
  if (round === "2" && phase === "2") return { round: "2", phase: "2", queryString: "?round=2&phase=2", isValid: true };
  if (round === "2" && phase === "3") return { round: "2", phase: "3", queryString: "?round=2&phase=3", isValid: true };

  // Invalid — fail safely to Round 1
  return { round: "1", phase: null, queryString: "?round=1", isValid: false };
}

/**
 * Maps contest stage keys ("round0", "round1", "round2_phase1", etc.)
 * to their canonical query string representation.
 */
export function getStageQuery(stage) {
  switch (stage) {
    case "round0": return "?round=0";
    case "round2_phase1": return "?round=2&phase=1";
    case "round2_phase2": return "?round=2&phase=2";
    case "round2_phase3": return "?round=2&phase=3";
    default: return "?round=1";
  }
}


/**
 * Helper to retrieve the target contest or challenge URL
 * for a given round, phase, and land key.
 *
 * @param {string|number} round - "0", "1", or "2"
 * @param {string|number|null} phase - "1", "2", or "3" (when round === "2")
 * @param {string} landKey - e.g. "volcano", "snow"
 * @returns {string} - The direct URL
 */
export function getLandContestUrl(round, phase, landKey) {
  const validated = validateContestParams({ round, phase });

  // Round 0: GFG external contest (single URL, no per-land links)
  if (validated.round === "0") {
    return CONTEST_CONFIG.round0.contestUrl;
  }

  // Round 2: per-phase per-land challenge URLs
  if (validated.round === "2") {
    const phaseKey =
      validated.phase === "3" ? "phase3" :
      validated.phase === "2" ? "phase2" : "phase1";
    const phaseConfig = CONTEST_CONFIG.round2[phaseKey];
    const land = phaseConfig.lands.find((l) => l.landKey === landKey);
    return land?.challengeUrl || phaseConfig.registrationUrl;
  }

  // Default: Round 1 per-land contest URLs
  const land = CONTEST_CONFIG.round1.lands.find((l) => l.landKey === landKey);
  return land?.contestUrl || "https://www.hackerrank.com";
}

/**
 * Helper to retrieve the official Landing Page URL (clean, without query params).
 *
 * @returns {string} - The complete Landing Page URL
 */
export function getLandingPageUrl() {
  return (
    import.meta.env.VITE_LANDING_URL ||
    (import.meta.env.DEV
      ? "http://127.0.0.1:5500/CF-Site/clash_of_coders.html"
      : "https://codersforum.netlify.app/clash_of_coders")
  );
}
