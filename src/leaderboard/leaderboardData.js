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
 */

// ── Round 0 — Top 40 Teams ────────────────────────────────────────────
export const round0Data = [
    { teamName: "Team Alpha",    leader: "Aditya Kumar",    rollNo: "22CS001", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Beta",     leader: "Bhavya Reddy",    rollNo: "22CS045", dept: "CSE",  year: "3rd Year", section: "B" },
    { teamName: "Team Gamma",    leader: "Chetan Sharma",   rollNo: "22IT010", dept: "IT",   year: "3rd Year", section: "A" },
    { teamName: "Team Delta",    leader: "Divya Nair",      rollNo: "22EC030", dept: "ECE",  year: "3rd Year", section: "C" },
    { teamName: "Team Epsilon",  leader: "Eshan Mehta",     rollNo: "22CS022", dept: "CSE",  year: "2nd Year", section: "A" },
    { teamName: "Team Zeta",     leader: "Farhan Siddiqui", rollNo: "22ME015", dept: "MECH", year: "3rd Year", section: "B" },
    { teamName: "Team Eta",      leader: "Gayathri Iyer",   rollNo: "22CS078", dept: "CSE",  year: "2nd Year", section: "C" },
    { teamName: "Team Theta",    leader: "Harsh Agarwal",   rollNo: "22IT055", dept: "IT",   year: "3rd Year", section: "A" },
    { teamName: "Team Iota",     leader: "Ishaan Joshi",    rollNo: "22CS091", dept: "CSE",  year: "2nd Year", section: "B" },
    { teamName: "Team Kappa",    leader: "Jyothi Priya",    rollNo: "22EC062", dept: "ECE",  year: "2nd Year", section: "A" },
    { teamName: "Team Lambda",   leader: "Kiran Bose",      rollNo: "22CS033", dept: "CSE",  year: "3rd Year", section: "C" },
    { teamName: "Team Mu",       leader: "Lakshmi Devi",    rollNo: "22IT020", dept: "IT",   year: "2nd Year", section: "B" },
    { teamName: "Team Nu",       leader: "Manish Gupta",    rollNo: "22CS067", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Xi",       leader: "Nikhil Varma",    rollNo: "22EC041", dept: "ECE",  year: "3rd Year", section: "B" },
    { teamName: "Team Omicron",  leader: "Oviya Suresh",    rollNo: "22CS083", dept: "CSE",  year: "2nd Year", section: "C" },
    { teamName: "Team Pi",       leader: "Pranav Menon",    rollNo: "22IT038", dept: "IT",   year: "3rd Year", section: "A" },
    { teamName: "Team Rho",      leader: "Qasim Ali",       rollNo: "22CS011", dept: "CSE",  year: "2nd Year", section: "B" },
    { teamName: "Team Sigma",    leader: "Ragini Das",      rollNo: "22EC074", dept: "ECE",  year: "2nd Year", section: "A" },
    { teamName: "Team Tau",      leader: "Suresh Pillai",   rollNo: "22CS050", dept: "CSE",  year: "3rd Year", section: "B" },
    { teamName: "Team Upsilon",  leader: "Tanvi Desai",     rollNo: "22IT027", dept: "IT",   year: "2nd Year", section: "C" },
    { teamName: "Team Phi",      leader: "Udit Singh",      rollNo: "22CS096", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Chi",      leader: "Vaishnavi Rao",   rollNo: "22EC018", dept: "ECE",  year: "3rd Year", section: "B" },
    { teamName: "Team Psi",      leader: "Wasim Khan",      rollNo: "22CS044", dept: "CSE",  year: "2nd Year", section: "C" },
    { teamName: "Team Omega",    leader: "Yamini Bhat",     rollNo: "22IT066", dept: "IT",   year: "2nd Year", section: "A" },
    { teamName: "Team Apex",     leader: "Zoya Mirza",      rollNo: "22CS059", dept: "CSE",  year: "3rd Year", section: "B" },
    { teamName: "Team Nexus",    leader: "Arun Krishnan",   rollNo: "22EC088", dept: "ECE",  year: "2nd Year", section: "A" },
    { teamName: "Team Vortex",   leader: "Bindu Sharma",    rollNo: "22CS072", dept: "CSE",  year: "3rd Year", section: "C" },
    { teamName: "Team Pulse",    leader: "Charu Saxena",    rollNo: "22IT003", dept: "IT",   year: "2nd Year", section: "B" },
    { teamName: "Team Orbit",    leader: "Deepak Nair",     rollNo: "22CS086", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Flux",     leader: "Elango R",        rollNo: "22EC057", dept: "ECE",  year: "2nd Year", section: "C" },
    { teamName: "Team Storm",    leader: "Fathima Begum",   rollNo: "22CS025", dept: "CSE",  year: "3rd Year", section: "B" },
    { teamName: "Team Blaze",    leader: "Ganesh Kumar",    rollNo: "22IT049", dept: "IT",   year: "2nd Year", section: "A" },
    { teamName: "Team Nova",     leader: "Harini Pillai",   rollNo: "22CS013", dept: "CSE",  year: "3rd Year", section: "C" },
    { teamName: "Team Cipher",   leader: "Irfan Shaikh",    rollNo: "22EC036", dept: "ECE",  year: "2nd Year", section: "B" },
    { teamName: "Team Zenith",   leader: "Jaya Lakshmi",    rollNo: "22CS094", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Cosmos",   leader: "Kartik Rao",      rollNo: "22IT081", dept: "IT",   year: "2nd Year", section: "C" },
    { teamName: "Team Axis",     leader: "Lavanya M",       rollNo: "22CS028", dept: "CSE",  year: "3rd Year", section: "B" },
    { teamName: "Team Radiant",  leader: "Manoj Karthik",   rollNo: "22EC069", dept: "ECE",  year: "2nd Year", section: "A" },
    { teamName: "Team Phantom",  leader: "Nisha Gopal",     rollNo: "22CS042", dept: "CSE",  year: "3rd Year", section: "C" },
    { teamName: "Team Eclipse",  leader: "Om Prakash",      rollNo: "22IT014", dept: "IT",   year: "2nd Year", section: "B" },
];

// ── Round 1 — Top 25 Teams ────────────────────────────────────────────
export const round1Data = [
    { teamName: "Team Alpha",    leader: "Aditya Kumar",    rollNo: "22CS001", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Gamma",    leader: "Chetan Sharma",   rollNo: "22IT010", dept: "IT",   year: "3rd Year", section: "A" },
    { teamName: "Team Delta",    leader: "Divya Nair",      rollNo: "22EC030", dept: "ECE",  year: "3rd Year", section: "C" },
    { teamName: "Team Beta",     leader: "Bhavya Reddy",    rollNo: "22CS045", dept: "CSE",  year: "3rd Year", section: "B" },
    { teamName: "Team Epsilon",  leader: "Eshan Mehta",     rollNo: "22CS022", dept: "CSE",  year: "2nd Year", section: "A" },
    { teamName: "Team Theta",    leader: "Harsh Agarwal",   rollNo: "22IT055", dept: "IT",   year: "3rd Year", section: "A" },
    { teamName: "Team Eta",      leader: "Gayathri Iyer",   rollNo: "22CS078", dept: "CSE",  year: "2nd Year", section: "C" },
    { teamName: "Team Lambda",   leader: "Kiran Bose",      rollNo: "22CS033", dept: "CSE",  year: "3rd Year", section: "C" },
    { teamName: "Team Iota",     leader: "Ishaan Joshi",    rollNo: "22CS091", dept: "CSE",  year: "2nd Year", section: "B" },
    { teamName: "Team Kappa",    leader: "Jyothi Priya",    rollNo: "22EC062", dept: "ECE",  year: "2nd Year", section: "A" },
    { teamName: "Team Nu",       leader: "Manish Gupta",    rollNo: "22CS067", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Mu",       leader: "Lakshmi Devi",    rollNo: "22IT020", dept: "IT",   year: "2nd Year", section: "B" },
    { teamName: "Team Sigma",    leader: "Ragini Das",      rollNo: "22EC074", dept: "ECE",  year: "2nd Year", section: "A" },
    { teamName: "Team Pi",       leader: "Pranav Menon",    rollNo: "22IT038", dept: "IT",   year: "3rd Year", section: "A" },
    { teamName: "Team Xi",       leader: "Nikhil Varma",    rollNo: "22EC041", dept: "ECE",  year: "3rd Year", section: "B" },
    { teamName: "Team Zeta",     leader: "Farhan Siddiqui", rollNo: "22ME015", dept: "MECH", year: "3rd Year", section: "B" },
    { teamName: "Team Tau",      leader: "Suresh Pillai",   rollNo: "22CS050", dept: "CSE",  year: "3rd Year", section: "B" },
    { teamName: "Team Phi",      leader: "Udit Singh",      rollNo: "22CS096", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Rho",      leader: "Qasim Ali",       rollNo: "22CS011", dept: "CSE",  year: "2nd Year", section: "B" },
    { teamName: "Team Omicron",  leader: "Oviya Suresh",    rollNo: "22CS083", dept: "CSE",  year: "2nd Year", section: "C" },
    { teamName: "Team Upsilon",  leader: "Tanvi Desai",     rollNo: "22IT027", dept: "IT",   year: "2nd Year", section: "C" },
    { teamName: "Team Chi",      leader: "Vaishnavi Rao",   rollNo: "22EC018", dept: "ECE",  year: "3rd Year", section: "B" },
    { teamName: "Team Psi",      leader: "Wasim Khan",      rollNo: "22CS044", dept: "CSE",  year: "2nd Year", section: "C" },
    { teamName: "Team Omega",    leader: "Yamini Bhat",     rollNo: "22IT066", dept: "IT",   year: "2nd Year", section: "A" },
    { teamName: "Team Apex",     leader: "Zoya Mirza",      rollNo: "22CS059", dept: "CSE",  year: "3rd Year", section: "B" },
];

// ── Round 2 — Phase 1 ─────────────────────────────────────────────────
export const phase1Data = [
    { teamName: "Team Alpha",   leader: "Aditya Kumar",    rollNo: "22CS001", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Delta",   leader: "Divya Nair",      rollNo: "22EC030", dept: "ECE",  year: "3rd Year", section: "C" },
    { teamName: "Team Gamma",   leader: "Chetan Sharma",   rollNo: "22IT010", dept: "IT",   year: "3rd Year", section: "A" },
    { teamName: "Team Beta",    leader: "Bhavya Reddy",    rollNo: "22CS045", dept: "CSE",  year: "3rd Year", section: "B" },
    { teamName: "Team Lambda",  leader: "Kiran Bose",      rollNo: "22CS033", dept: "CSE",  year: "3rd Year", section: "C" },
    { teamName: "Team Theta",   leader: "Harsh Agarwal",   rollNo: "22IT055", dept: "IT",   year: "3rd Year", section: "A" },
    { teamName: "Team Eta",     leader: "Gayathri Iyer",   rollNo: "22CS078", dept: "CSE",  year: "2nd Year", section: "C" },
    { teamName: "Team Nu",      leader: "Manish Gupta",    rollNo: "22CS067", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Kappa",   leader: "Jyothi Priya",    rollNo: "22EC062", dept: "ECE",  year: "2nd Year", section: "A" },
    { teamName: "Team Epsilon", leader: "Eshan Mehta",     rollNo: "22CS022", dept: "CSE",  year: "2nd Year", section: "A" },
];

// ── Round 2 — Phase 2 ─────────────────────────────────────────────────
export const phase2Data = [
    { teamName: "Team Alpha",   leader: "Aditya Kumar",    rollNo: "22CS001", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Delta",   leader: "Divya Nair",      rollNo: "22EC030", dept: "ECE",  year: "3rd Year", section: "C" },
    { teamName: "Team Gamma",   leader: "Chetan Sharma",   rollNo: "22IT010", dept: "IT",   year: "3rd Year", section: "A" },
    { teamName: "Team Lambda",  leader: "Kiran Bose",      rollNo: "22CS033", dept: "CSE",  year: "3rd Year", section: "C" },
    { teamName: "Team Beta",    leader: "Bhavya Reddy",    rollNo: "22CS045", dept: "CSE",  year: "3rd Year", section: "B" },
    { teamName: "Team Theta",   leader: "Harsh Agarwal",   rollNo: "22IT055", dept: "IT",   year: "3rd Year", section: "A" },
    { teamName: "Team Eta",     leader: "Gayathri Iyer",   rollNo: "22CS078", dept: "CSE",  year: "2nd Year", section: "C" },
    { teamName: "Team Nu",      leader: "Manish Gupta",    rollNo: "22CS067", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Epsilon", leader: "Eshan Mehta",     rollNo: "22CS022", dept: "CSE",  year: "2nd Year", section: "A" },
    { teamName: "Team Kappa",   leader: "Jyothi Priya",    rollNo: "22EC062", dept: "ECE",  year: "2nd Year", section: "A" },
];

// ── Final Standings ───────────────────────────────────────────────────
export const overallData = [
    { teamName: "Team Alpha",   leader: "Aditya Kumar",    rollNo: "22CS001", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Delta",   leader: "Divya Nair",      rollNo: "22EC030", dept: "ECE",  year: "3rd Year", section: "C" },
    { teamName: "Team Gamma",   leader: "Chetan Sharma",   rollNo: "22IT010", dept: "IT",   year: "3rd Year", section: "A" },
    { teamName: "Team Lambda",  leader: "Kiran Bose",      rollNo: "22CS033", dept: "CSE",  year: "3rd Year", section: "C" },
    { teamName: "Team Beta",    leader: "Bhavya Reddy",    rollNo: "22CS045", dept: "CSE",  year: "3rd Year", section: "B" },
    { teamName: "Team Theta",   leader: "Harsh Agarwal",   rollNo: "22IT055", dept: "IT",   year: "3rd Year", section: "A" },
    { teamName: "Team Eta",     leader: "Gayathri Iyer",   rollNo: "22CS078", dept: "CSE",  year: "2nd Year", section: "C" },
    { teamName: "Team Nu",      leader: "Manish Gupta",    rollNo: "22CS067", dept: "CSE",  year: "3rd Year", section: "A" },
    { teamName: "Team Epsilon", leader: "Eshan Mehta",     rollNo: "22CS022", dept: "CSE",  year: "2nd Year", section: "A" },
    { teamName: "Team Kappa",   leader: "Jyothi Priya",    rollNo: "22EC062", dept: "ECE",  year: "2nd Year", section: "A" },
].sort((a, b) => b.score - a.score);
