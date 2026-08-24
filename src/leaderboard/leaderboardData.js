/**
 * Leaderboard Data — Clash of Coders
 * ------------------------------------
 * Each entry has:
 *   teamName    : string  — Team name displayed
 *   leader      : string  — Team leader's full name
 *   rollNo      : string  — Leader's roll number
 *   dept        : string  — Department (e.g. "CSE", "ECE")
 *   year        : string  — Year of study (e.g. "2nd Year")
 *   section     : string  — Section (e.g. "A", "B")
 *   score       : number  — Contest score / points
 */

// ── Round 0 — Top 40 Teams ────────────────────────────────────────────
export const round0Data = [
    { teamName: "Team Alpha",    leader: "Aditya Kumar",    rollNo: "22CS001", dept: "CSE",  year: "3rd Year", section: "A", score: 3000 },
    { teamName: "Team Beta",     leader: "Bhavya Reddy",    rollNo: "22CS045", dept: "CSE",  year: "3rd Year", section: "B", score: 2985 },
    { teamName: "Team Gamma",    leader: "Chetan Sharma",   rollNo: "22IT010", dept: "IT",   year: "3rd Year", section: "A", score: 2970 },
    { teamName: "Team Delta",    leader: "Divya Nair",      rollNo: "22EC030", dept: "ECE",  year: "3rd Year", section: "C", score: 2955 },
    { teamName: "Team Epsilon",  leader: "Eshan Mehta",     rollNo: "22CS022", dept: "CSE",  year: "2nd Year", section: "A", score: 2940 },
    { teamName: "Team Zeta",     leader: "Farhan Siddiqui", rollNo: "22ME015", dept: "MECH", year: "3rd Year", section: "B", score: 2925 },
    { teamName: "Team Eta",      leader: "Gayathri Iyer",   rollNo: "22CS078", dept: "CSE",  year: "2nd Year", section: "C", score: 2910 },
    { teamName: "Team Theta",    leader: "Harsh Agarwal",   rollNo: "22IT055", dept: "IT",   year: "3rd Year", section: "A", score: 2895 },
    { teamName: "Team Iota",     leader: "Ishaan Joshi",    rollNo: "22CS091", dept: "CSE",  year: "2nd Year", section: "B", score: 2880 },
    { teamName: "Team Kappa",    leader: "Jyothi Priya",    rollNo: "22EC062", dept: "ECE",  year: "2nd Year", section: "A", score: 2865 },
    { teamName: "Team Lambda",   leader: "Kiran Bose",      rollNo: "22CS033", dept: "CSE",  year: "3rd Year", section: "C", score: 2850 },
    { teamName: "Team Mu",       leader: "Lakshmi Devi",    rollNo: "22IT020", dept: "IT",   year: "2nd Year", section: "B", score: 2835 },
    { teamName: "Team Nu",       leader: "Manish Gupta",    rollNo: "22CS067", dept: "CSE",  year: "3rd Year", section: "A", score: 2820 },
    { teamName: "Team Xi",       leader: "Nikhil Varma",    rollNo: "22EC041", dept: "ECE",  year: "3rd Year", section: "B", score: 2805 },
    { teamName: "Team Omicron",  leader: "Oviya Suresh",    rollNo: "22CS083", dept: "CSE",  year: "2nd Year", section: "C", score: 2790 },
    { teamName: "Team Pi",       leader: "Pranav Menon",    rollNo: "22IT038", dept: "IT",   year: "3rd Year", section: "A", score: 2775 },
    { teamName: "Team Rho",      leader: "Qasim Ali",       rollNo: "22CS011", dept: "CSE",  year: "2nd Year", section: "B", score: 2760 },
    { teamName: "Team Sigma",    leader: "Ragini Das",      rollNo: "22EC074", dept: "ECE",  year: "2nd Year", section: "A", score: 2745 },
    { teamName: "Team Tau",      leader: "Suresh Pillai",   rollNo: "22CS050", dept: "CSE",  year: "3rd Year", section: "B", score: 2730 },
    { teamName: "Team Upsilon",  leader: "Tanvi Desai",     rollNo: "22IT027", dept: "IT",   year: "2nd Year", section: "C", score: 2715 },
    { teamName: "Team Phi",      leader: "Udit Singh",      rollNo: "22CS096", dept: "CSE",  year: "3rd Year", section: "A", score: 2700 },
    { teamName: "Team Chi",      leader: "Vaishnavi Rao",   rollNo: "22EC018", dept: "ECE",  year: "3rd Year", section: "B", score: 2685 },
    { teamName: "Team Psi",      leader: "Wasim Khan",      rollNo: "22CS044", dept: "CSE",  year: "2nd Year", section: "C", score: 2670 },
    { teamName: "Team Omega",    leader: "Yamini Bhat",     rollNo: "22IT066", dept: "IT",   year: "2nd Year", section: "A", score: 2655 },
    { teamName: "Team Apex",     leader: "Zoya Mirza",      rollNo: "22CS059", dept: "CSE",  year: "3rd Year", section: "B", score: 2640 },
    { teamName: "Team Nexus",    leader: "Arun Krishnan",   rollNo: "22EC088", dept: "ECE",  year: "2nd Year", section: "A", score: 2625 },
    { teamName: "Team Vortex",   leader: "Bindu Sharma",    rollNo: "22CS072", dept: "CSE",  year: "3rd Year", section: "C", score: 2610 },
    { teamName: "Team Pulse",    leader: "Charu Saxena",    rollNo: "22IT003", dept: "IT",   year: "2nd Year", section: "B", score: 2595 },
    { teamName: "Team Orbit",    leader: "Deepak Nair",     rollNo: "22CS086", dept: "CSE",  year: "3rd Year", section: "A", score: 2580 },
    { teamName: "Team Flux",     leader: "Elango R",        rollNo: "22EC057", dept: "ECE",  year: "2nd Year", section: "C", score: 2565 },
    { teamName: "Team Storm",    leader: "Fathima Begum",   rollNo: "22CS025", dept: "CSE",  year: "3rd Year", section: "B", score: 2550 },
    { teamName: "Team Blaze",    leader: "Ganesh Kumar",    rollNo: "22IT049", dept: "IT",   year: "2nd Year", section: "A", score: 2535 },
    { teamName: "Team Nova",     leader: "Harini Pillai",   rollNo: "22CS013", dept: "CSE",  year: "3rd Year", section: "C", score: 2520 },
    { teamName: "Team Cipher",   leader: "Irfan Shaikh",    rollNo: "22EC036", dept: "ECE",  year: "2nd Year", section: "B", score: 2505 },
    { teamName: "Team Zenith",   leader: "Jaya Lakshmi",    rollNo: "22CS094", dept: "CSE",  year: "3rd Year", section: "A", score: 2490 },
    { teamName: "Team Cosmos",   leader: "Kartik Rao",      rollNo: "22IT081", dept: "IT",   year: "2nd Year", section: "C", score: 2475 },
    { teamName: "Team Axis",     leader: "Lavanya M",       rollNo: "22CS028", dept: "CSE",  year: "3rd Year", section: "B", score: 2460 },
    { teamName: "Team Radiant",  leader: "Manoj Karthik",   rollNo: "22EC069", dept: "ECE",  year: "2nd Year", section: "A", score: 2445 },
    { teamName: "Team Phantom",  leader: "Nisha Gopal",     rollNo: "22CS042", dept: "CSE",  year: "3rd Year", section: "C", score: 2430 },
    { teamName: "Team Eclipse",  leader: "Om Prakash",      rollNo: "22IT014", dept: "IT",   year: "2nd Year", section: "B", score: 2415 },
];

// ── Round 1 — Top 25 Teams ────────────────────────────────────────────
export const round1Data = [
    { teamName: "Team Alpha",    leader: "Aditya Kumar",    rollNo: "22CS001", dept: "CSE",  year: "3rd Year", section: "A", score: 2800 },
    { teamName: "Team Gamma",    leader: "Chetan Sharma",   rollNo: "22IT010", dept: "IT",   year: "3rd Year", section: "A", score: 2760 },
    { teamName: "Team Delta",    leader: "Divya Nair",      rollNo: "22EC030", dept: "ECE",  year: "3rd Year", section: "C", score: 2720 },
    { teamName: "Team Beta",     leader: "Bhavya Reddy",    rollNo: "22CS045", dept: "CSE",  year: "3rd Year", section: "B", score: 2680 },
    { teamName: "Team Epsilon",  leader: "Eshan Mehta",     rollNo: "22CS022", dept: "CSE",  year: "2nd Year", section: "A", score: 2640 },
    { teamName: "Team Theta",    leader: "Harsh Agarwal",   rollNo: "22IT055", dept: "IT",   year: "3rd Year", section: "A", score: 2600 },
    { teamName: "Team Eta",      leader: "Gayathri Iyer",   rollNo: "22CS078", dept: "CSE",  year: "2nd Year", section: "C", score: 2560 },
    { teamName: "Team Lambda",   leader: "Kiran Bose",      rollNo: "22CS033", dept: "CSE",  year: "3rd Year", section: "C", score: 2520 },
    { teamName: "Team Iota",     leader: "Ishaan Joshi",    rollNo: "22CS091", dept: "CSE",  year: "2nd Year", section: "B", score: 2480 },
    { teamName: "Team Kappa",    leader: "Jyothi Priya",    rollNo: "22EC062", dept: "ECE",  year: "2nd Year", section: "A", score: 2440 },
    { teamName: "Team Nu",       leader: "Manish Gupta",    rollNo: "22CS067", dept: "CSE",  year: "3rd Year", section: "A", score: 2400 },
    { teamName: "Team Mu",       leader: "Lakshmi Devi",    rollNo: "22IT020", dept: "IT",   year: "2nd Year", section: "B", score: 2360 },
    { teamName: "Team Sigma",    leader: "Ragini Das",      rollNo: "22EC074", dept: "ECE",  year: "2nd Year", section: "A", score: 2320 },
    { teamName: "Team Pi",       leader: "Pranav Menon",    rollNo: "22IT038", dept: "IT",   year: "3rd Year", section: "A", score: 2280 },
    { teamName: "Team Xi",       leader: "Nikhil Varma",    rollNo: "22EC041", dept: "ECE",  year: "3rd Year", section: "B", score: 2240 },
    { teamName: "Team Zeta",     leader: "Farhan Siddiqui", rollNo: "22ME015", dept: "MECH", year: "3rd Year", section: "B", score: 2200 },
    { teamName: "Team Tau",      leader: "Suresh Pillai",   rollNo: "22CS050", dept: "CSE",  year: "3rd Year", section: "B", score: 2160 },
    { teamName: "Team Phi",      leader: "Udit Singh",      rollNo: "22CS096", dept: "CSE",  year: "3rd Year", section: "A", score: 2120 },
    { teamName: "Team Rho",      leader: "Qasim Ali",       rollNo: "22CS011", dept: "CSE",  year: "2nd Year", section: "B", score: 2080 },
    { teamName: "Team Omicron",  leader: "Oviya Suresh",    rollNo: "22CS083", dept: "CSE",  year: "2nd Year", section: "C", score: 2040 },
    { teamName: "Team Upsilon",  leader: "Tanvi Desai",     rollNo: "22IT027", dept: "IT",   year: "2nd Year", section: "C", score: 2000 },
    { teamName: "Team Chi",      leader: "Vaishnavi Rao",   rollNo: "22EC018", dept: "ECE",  year: "3rd Year", section: "B", score: 1960 },
    { teamName: "Team Psi",      leader: "Wasim Khan",      rollNo: "22CS044", dept: "CSE",  year: "2nd Year", section: "C", score: 1920 },
    { teamName: "Team Omega",    leader: "Yamini Bhat",     rollNo: "22IT066", dept: "IT",   year: "2nd Year", section: "A", score: 1880 },
    { teamName: "Team Apex",     leader: "Zoya Mirza",      rollNo: "22CS059", dept: "CSE",  year: "3rd Year", section: "B", score: 1840 },
];

// ── Round 2 — Phase 1 ─────────────────────────────────────────────────
export const phase1Data = [
    { teamName: "Team Alpha",   leader: "Aditya Kumar",    rollNo: "22CS001", dept: "CSE",  year: "3rd Year", section: "A", score: 2450 },
    { teamName: "Team Delta",   leader: "Divya Nair",      rollNo: "22EC030", dept: "ECE",  year: "3rd Year", section: "C", score: 2380 },
    { teamName: "Team Gamma",   leader: "Chetan Sharma",   rollNo: "22IT010", dept: "IT",   year: "3rd Year", section: "A", score: 2310 },
    { teamName: "Team Beta",    leader: "Bhavya Reddy",    rollNo: "22CS045", dept: "CSE",  year: "3rd Year", section: "B", score: 2240 },
    { teamName: "Team Lambda",  leader: "Kiran Bose",      rollNo: "22CS033", dept: "CSE",  year: "3rd Year", section: "C", score: 2195 },
    { teamName: "Team Theta",   leader: "Harsh Agarwal",   rollNo: "22IT055", dept: "IT",   year: "3rd Year", section: "A", score: 2100 },
    { teamName: "Team Eta",     leader: "Gayathri Iyer",   rollNo: "22CS078", dept: "CSE",  year: "2nd Year", section: "C", score: 2050 },
    { teamName: "Team Nu",      leader: "Manish Gupta",    rollNo: "22CS067", dept: "CSE",  year: "3rd Year", section: "A", score: 1990 },
    { teamName: "Team Kappa",   leader: "Jyothi Priya",    rollNo: "22EC062", dept: "ECE",  year: "2nd Year", section: "A", score: 1940 },
    { teamName: "Team Epsilon", leader: "Eshan Mehta",     rollNo: "22CS022", dept: "CSE",  year: "2nd Year", section: "A", score: 1880 },
];

// ── Round 2 — Phase 2 ─────────────────────────────────────────────────
export const phase2Data = [
    { teamName: "Team Alpha",   leader: "Aditya Kumar",    rollNo: "22CS001", dept: "CSE",  year: "3rd Year", section: "A", score: 2510 },
    { teamName: "Team Delta",   leader: "Divya Nair",      rollNo: "22EC030", dept: "ECE",  year: "3rd Year", section: "C", score: 2470 },
    { teamName: "Team Gamma",   leader: "Chetan Sharma",   rollNo: "22IT010", dept: "IT",   year: "3rd Year", section: "A", score: 2390 },
    { teamName: "Team Lambda",  leader: "Kiran Bose",      rollNo: "22CS033", dept: "CSE",  year: "3rd Year", section: "C", score: 2320 },
    { teamName: "Team Beta",    leader: "Bhavya Reddy",    rollNo: "22CS045", dept: "CSE",  year: "3rd Year", section: "B", score: 2260 },
    { teamName: "Team Theta",   leader: "Harsh Agarwal",   rollNo: "22IT055", dept: "IT",   year: "3rd Year", section: "A", score: 2190 },
    { teamName: "Team Eta",     leader: "Gayathri Iyer",   rollNo: "22CS078", dept: "CSE",  year: "2nd Year", section: "C", score: 2110 },
    { teamName: "Team Nu",      leader: "Manish Gupta",    rollNo: "22CS067", dept: "CSE",  year: "3rd Year", section: "A", score: 2050 },
    { teamName: "Team Epsilon", leader: "Eshan Mehta",     rollNo: "22CS022", dept: "CSE",  year: "2nd Year", section: "A", score: 1970 },
    { teamName: "Team Kappa",   leader: "Jyothi Priya",    rollNo: "22EC062", dept: "ECE",  year: "2nd Year", section: "A", score: 1900 },
];

// ── Final Standings ───────────────────────────────────────────────────
export const overallData = [
    { teamName: "Team Alpha",   leader: "Aditya Kumar",    rollNo: "22CS001", dept: "CSE",  year: "3rd Year", section: "A", score: 4960 },
    { teamName: "Team Delta",   leader: "Divya Nair",      rollNo: "22EC030", dept: "ECE",  year: "3rd Year", section: "C", score: 4850 },
    { teamName: "Team Gamma",   leader: "Chetan Sharma",   rollNo: "22IT010", dept: "IT",   year: "3rd Year", section: "A", score: 4700 },
    { teamName: "Team Lambda",  leader: "Kiran Bose",      rollNo: "22CS033", dept: "CSE",  year: "3rd Year", section: "C", score: 4515 },
    { teamName: "Team Beta",    leader: "Bhavya Reddy",    rollNo: "22CS045", dept: "CSE",  year: "3rd Year", section: "B", score: 4500 },
    { teamName: "Team Theta",   leader: "Harsh Agarwal",   rollNo: "22IT055", dept: "IT",   year: "3rd Year", section: "A", score: 4290 },
    { teamName: "Team Eta",     leader: "Gayathri Iyer",   rollNo: "22CS078", dept: "CSE",  year: "2nd Year", section: "C", score: 4160 },
    { teamName: "Team Nu",      leader: "Manish Gupta",    rollNo: "22CS067", dept: "CSE",  year: "3rd Year", section: "A", score: 4040 },
    { teamName: "Team Epsilon", leader: "Eshan Mehta",     rollNo: "22CS022", dept: "CSE",  year: "2nd Year", section: "A", score: 3850 },
    { teamName: "Team Kappa",   leader: "Jyothi Priya",    rollNo: "22EC062", dept: "ECE",  year: "2nd Year", section: "A", score: 3840 },
].sort((a, b) => b.score - a.score);