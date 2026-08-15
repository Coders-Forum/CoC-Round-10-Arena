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
 * ═══════════════════════════════════════════════════════════════════
 */

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
      { landId: 1,  landKey: "volcano",    landName: "Array Realm",                contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-01" },
      { landId: 2,  landKey: "snow",       landName: "String Sanctum",             contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-02" },
      { landId: 3,  landKey: "plant",      landName: "Hash Table Isle",            contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-03" },
      { landId: 4,  landKey: "island",     landName: "Math Arena",                 contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-04" },
      { landId: 5,  landKey: "coliseum",   landName: "Sorting Coliseum",           contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-05" },
      { landId: 6,  landKey: "pyramid",    landName: "Searching Pyramid",          contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-06" },
      { landId: 7,  landKey: "castle",     landName: "DFS Fortress",               contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-07" },
      { landId: 8,  landKey: "ruin",       landName: "BFS Ruins",                  contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-08" },
      { landId: 9,  landKey: "mayan",      landName: "Database Temple",            contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-09" },
      { landId: 10, landKey: "greek",      landName: "Matrix Shrine",              contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-10" },
      { landId: 11, landKey: "pagoda",     landName: "2 Pointers Pagoda",          contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-11" },
      { landId: 12, landKey: "pedestal",   landName: "Sliding Window Pedestal",    contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-12" },
      { landId: 13, landKey: "cathedral",  landName: "Stack Citadel",              contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-13" },
      { landId: 14, landKey: "torii",      landName: "Queue Gate",                 contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-14" },
      { landId: 15, landKey: "castle2",    landName: "Linked List Fort",           contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-15" },
      { landId: 16, landKey: "pagoda2",    landName: "Pattern Tower",              contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-16" },
      { landId: 17, landKey: "barracks",   landName: "Recursion Barracks",         contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-17" },
      { landId: 18, landKey: "palace",     landName: "Backtracking Palace",        contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-18" },
      { landId: 19, landKey: "shrine",     landName: "Bit Manipulation Shrine",    contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-19" },
      { landId: 20, landKey: "deadforest", landName: "Mystery Land",               contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-20" },
      { landId: 21, landKey: "temple",     landName: "Set Sanctuary",              contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-21" },
      { landId: 22, landKey: "archway",    landName: "DP Monument",                contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-22" },
      { landId: 23, landKey: "necro",      landName: "Priority Queue Necropolis",  contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-23" },
      { landId: 24, landKey: "cemetery",   landName: "Prefix & Suffix Realm",      contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-24" },
      { landId: 25, landKey: "pillars",    landName: "Greedy Pillars",             contestUrl: "https://www.hackerrank.com/contests/coc-round1-land-25" },
    ],
  },

  // ── ROUND 2 CONFIGURATION ──────────────────────────────────────────
  round2: {
    // Phase 1
    phase1: {
      title: "Round 2 — Phase 1 (Offline)",
      registrationUrl: "https://www.hackerrank.com/contests/coc-round2-phase1",
      buttonText: "REGISTER FOR PHASE 1",
      enterButtonText: "ENTER PHASE 1",
      lands: [
        { landId: 1,  landKey: "volcano",    landName: "Array Realm",               challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-01" },
        { landId: 2,  landKey: "snow",       landName: "String Sanctum",            challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-02" },
        { landId: 3,  landKey: "plant",      landName: "Hash Table Isle",           challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-03" },
        { landId: 4,  landKey: "island",     landName: "Math Arena",                challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-04" },
        { landId: 5,  landKey: "coliseum",   landName: "Sorting Coliseum",          challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-05" },
        { landId: 6,  landKey: "pyramid",    landName: "Searching Pyramid",         challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-06" },
        { landId: 7,  landKey: "castle",     landName: "DFS Fortress",              challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-07" },
        { landId: 8,  landKey: "ruin",       landName: "BFS Ruins",                 challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-08" },
        { landId: 9,  landKey: "mayan",      landName: "Database Temple",           challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-09" },
        { landId: 10, landKey: "greek",      landName: "Matrix Shrine",             challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-10" },
        { landId: 11, landKey: "pagoda",     landName: "2 Pointers Pagoda",         challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-11" },
        { landId: 12, landKey: "pedestal",   landName: "Sliding Window Pedestal",   challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-12" },
        { landId: 13, landKey: "cathedral",  landName: "Stack Citadel",             challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-13" },
        { landId: 14, landKey: "torii",      landName: "Queue Gate",                challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-14" },
        { landId: 15, landKey: "castle2",    landName: "Linked List Fort",          challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-15" },
        { landId: 16, landKey: "pagoda2",    landName: "Pattern Tower",             challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-16" },
        { landId: 17, landKey: "barracks",   landName: "Recursion Barracks",        challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-17" },
        { landId: 18, landKey: "palace",     landName: "Backtracking Palace",       challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-18" },
        { landId: 19, landKey: "shrine",     landName: "Bit Manipulation Shrine",   challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-19" },
        { landId: 20, landKey: "deadforest", landName: "Mystery Land",              challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-20" },
        { landId: 21, landKey: "temple",     landName: "Set Sanctuary",             challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-21" },
        { landId: 22, landKey: "archway",    landName: "DP Monument",               challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-22" },
        { landId: 23, landKey: "necro",      landName: "Priority Queue Necropolis", challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-23" },
        { landId: 24, landKey: "cemetery",   landName: "Prefix & Suffix Realm",     challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-24" },
        { landId: 25, landKey: "pillars",    landName: "Greedy Pillars",            challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase1/challenges/coc-r2p1-land-25" },
      ],
    },

    // Phase 2
    phase2: {
      title: "Round 2 — Phase 2 (Offline)",
      registrationUrl: "https://www.hackerrank.com/contests/coc-round2-phase2",
      buttonText: "REGISTER FOR PHASE 2",
      enterButtonText: "ENTER PHASE 2",
      lands: [
        { landId: 1,  landKey: "volcano",    landName: "Array Realm",               challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-01" },
        { landId: 2,  landKey: "snow",       landName: "String Sanctum",            challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-02" },
        { landId: 3,  landKey: "plant",      landName: "Hash Table Isle",           challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-03" },
        { landId: 4,  landKey: "island",     landName: "Math Arena",                challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-04" },
        { landId: 5,  landKey: "coliseum",   landName: "Sorting Coliseum",          challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-05" },
        { landId: 6,  landKey: "pyramid",    landName: "Searching Pyramid",         challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-06" },
        { landId: 7,  landKey: "castle",     landName: "DFS Fortress",              challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-07" },
        { landId: 8,  landKey: "ruin",       landName: "BFS Ruins",                 challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-08" },
        { landId: 9,  landKey: "mayan",      landName: "Database Temple",           challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-09" },
        { landId: 10, landKey: "greek",      landName: "Matrix Shrine",             challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-10" },
        { landId: 11, landKey: "pagoda",     landName: "2 Pointers Pagoda",         challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-11" },
        { landId: 12, landKey: "pedestal",   landName: "Sliding Window Pedestal",   challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-12" },
        { landId: 13, landKey: "cathedral",  landName: "Stack Citadel",             challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-13" },
        { landId: 14, landKey: "torii",      landName: "Queue Gate",                challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-14" },
        { landId: 15, landKey: "castle2",    landName: "Linked List Fort",          challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-15" },
        { landId: 16, landKey: "pagoda2",    landName: "Pattern Tower",             challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-16" },
        { landId: 17, landKey: "barracks",   landName: "Recursion Barracks",        challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-17" },
        { landId: 18, landKey: "palace",     landName: "Backtracking Palace",       challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-18" },
        { landId: 19, landKey: "shrine",     landName: "Bit Manipulation Shrine",   challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-19" },
        { landId: 20, landKey: "deadforest", landName: "Mystery Land",              challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-20" },
        { landId: 21, landKey: "temple",     landName: "Set Sanctuary",             challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-21" },
        { landId: 22, landKey: "archway",    landName: "DP Monument",               challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-22" },
        { landId: 23, landKey: "necro",      landName: "Priority Queue Necropolis", challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-23" },
        { landId: 24, landKey: "cemetery",   landName: "Prefix & Suffix Realm",     challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-24" },
        { landId: 25, landKey: "pillars",    landName: "Greedy Pillars",            challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase2/challenges/coc-r2p2-land-25" },
      ],
    },

    // Phase 3
    phase3: {
      title: "Round 2 — Phase 3 (Offline)",
      registrationUrl: "https://www.hackerrank.com/contests/coc-round2-phase3",
      buttonText: "REGISTER FOR PHASE 3",
      enterButtonText: "ENTER PHASE 3",
      lands: [
        { landId: 1,  landKey: "volcano",    landName: "Array Realm",               challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-01" },
        { landId: 2,  landKey: "snow",       landName: "String Sanctum",            challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-02" },
        { landId: 3,  landKey: "plant",      landName: "Hash Table Isle",           challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-03" },
        { landId: 4,  landKey: "island",     landName: "Math Arena",                challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-04" },
        { landId: 5,  landKey: "coliseum",   landName: "Sorting Coliseum",          challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-05" },
        { landId: 6,  landKey: "pyramid",    landName: "Searching Pyramid",         challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-06" },
        { landId: 7,  landKey: "castle",     landName: "DFS Fortress",              challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-07" },
        { landId: 8,  landKey: "ruin",       landName: "BFS Ruins",                 challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-08" },
        { landId: 9,  landKey: "mayan",      landName: "Database Temple",           challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-09" },
        { landId: 10, landKey: "greek",      landName: "Matrix Shrine",             challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-10" },
        { landId: 11, landKey: "pagoda",     landName: "2 Pointers Pagoda",         challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-11" },
        { landId: 12, landKey: "pedestal",   landName: "Sliding Window Pedestal",   challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-12" },
        { landId: 13, landKey: "cathedral",  landName: "Stack Citadel",             challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-13" },
        { landId: 14, landKey: "torii",      landName: "Queue Gate",                challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-14" },
        { landId: 15, landKey: "castle2",    landName: "Linked List Fort",          challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-15" },
        { landId: 16, landKey: "pagoda2",    landName: "Pattern Tower",             challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-16" },
        { landId: 17, landKey: "barracks",   landName: "Recursion Barracks",        challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-17" },
        { landId: 18, landKey: "palace",     landName: "Backtracking Palace",       challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-18" },
        { landId: 19, landKey: "shrine",     landName: "Bit Manipulation Shrine",   challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-19" },
        { landId: 20, landKey: "deadforest", landName: "Mystery Land",              challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-20" },
        { landId: 21, landKey: "temple",     landName: "Set Sanctuary",             challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-21" },
        { landId: 22, landKey: "archway",    landName: "DP Monument",               challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-22" },
        { landId: 23, landKey: "necro",      landName: "Priority Queue Necropolis", challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-23" },
        { landId: 24, landKey: "cemetery",   landName: "Prefix & Suffix Realm",     challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-24" },
        { landId: 25, landKey: "pillars",    landName: "Greedy Pillars",            challengeUrl: "https://www.hackerrank.com/contests/coc-round2-phase3/challenges/coc-r2p3-land-25" },
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
