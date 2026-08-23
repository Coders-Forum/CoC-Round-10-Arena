export const round0Data = Array.from({ length: 40 }, (_, i) => ({
    teamName: `Team ${String.fromCharCode(65 + (i % 26))}${i}`,
    score: 3000 - i * 15
}));

export const round1Data = Array.from({ length: 25 }, (_, i) => ({
    teamName: `Team ${String.fromCharCode(65 + (i % 26))}${i}`,
    score: 2800 - i * 20
}));

export const phase1Data = [
    { teamName: "Team X", score: 2450 },
    { teamName: "Team Y", score: 2380 },
    { teamName: "Team Z", score: 2310 },
    { teamName: "Team A", score: 2240 },
    { teamName: "Team B", score: 2195 },
    { teamName: "Team C", score: 2100 },
    { teamName: "Team D", score: 2050 },
    { teamName: "Team E", score: 1990 },
    { teamName: "Team F", score: 1940 },
    { teamName: "Team G", score: 1880 }
];

export const phase2Data = [
    { teamName: "Team B", score: 2510 },
    { teamName: "Team X", score: 2470 },
    { teamName: "Team D", score: 2390 },
    { teamName: "Team Y", score: 2320 },
    { teamName: "Team C", score: 2260 },
    { teamName: "Team A", score: 2190 },
    { teamName: "Team F", score: 2110 },
    { teamName: "Team Z", score: 2050 },
    { teamName: "Team E", score: 1970 },
    { teamName: "Team G", score: 1900 }
];

export const overallData = [
    { teamName: "Team X", score: 4920 },
    { teamName: "Team B", score: 4705 },
    { teamName: "Team Y", score: 4700 },
    { teamName: "Team A", score: 4430 },
    { teamName: "Team D", score: 4440 },
    { teamName: "Team C", score: 4360 },
    { teamName: "Team Z", score: 4360 },
    { teamName: "Team F", score: 4050 },
    { teamName: "Team E", score: 3960 },
    { teamName: "Team G", score: 3780 }
].sort((a, b) => b.score - a.score);