/**
 * Centralized Environmental Background Configuration for CLASH OF CODERS 3D Arena
 * Maps land/environment IDs to dedicated cinematic background images and atmospheric effect presets.
 */

const base = import.meta.env.BASE_URL || "./"

export const DEFAULT_BACKGROUND = `${base}backgrounds/volcano.jpg`

export const LAND_BACKGROUNDS = {
    volcano: {
        image: `${base}backgrounds/volcano.jpg`,
        effectType: "embers",
        accentColor: "#ff4500",
        glowColor: "#ff2200"
    },
    snow: {
        image: `${base}backgrounds/frozen.jpg`,
        effectType: "snow",
        accentColor: "#88ccff",
        glowColor: "#aaddff"
    },
    plant: {
        image: `${base}backgrounds/jungle.jpg`,
        effectType: "mist",
        accentColor: "#44cc44",
        glowColor: "#22aa00"
    },
    island: {
        image: `${base}backgrounds/island.jpg`,
        effectType: "mist",
        accentColor: "#00ccff",
        glowColor: "#00aadd"
    },
    coliseum: {
        image: `${base}backgrounds/coliseum.jpg`,
        effectType: "sparks",
        accentColor: "#c0d0ff",
        glowColor: "#8899dd"
    },
    pyramid: {
        image: `${base}backgrounds/desert.jpg`,
        effectType: "dust",
        accentColor: "#ffaa00",
        glowColor: "#ff8800"
    },
    castle: {
        image: `${base}backgrounds/castle.jpg`,
        effectType: "mist",
        accentColor: "#9988cc",
        glowColor: "#6655aa"
    },
    ruin: {
        image: `${base}backgrounds/ruins.jpg`,
        effectType: "dust",
        accentColor: "#88aa44",
        glowColor: "#446622"
    },
    mayan: {
        image: `${base}backgrounds/mayan.jpg`,
        effectType: "mist",
        accentColor: "#cc8833",
        glowColor: "#aa6611"
    },
    greek: {
        image: `${base}backgrounds/greek.jpg`,
        effectType: "mist",
        accentColor: "#fff8ee",
        glowColor: "#ddcc99"
    },
    pagoda: {
        image: `${base}backgrounds/pagoda.jpg`,
        effectType: "embers",
        accentColor: "#cc2200",
        glowColor: "#ff4400"
    },
    pedestal: {
        image: `${base}backgrounds/pedestal.jpg`,
        effectType: "snow",
        accentColor: "#aabbcc",
        glowColor: "#ddeeff"
    },
    cathedral: {
        image: `${base}backgrounds/santorini.jpg`,
        effectType: "mist",
        accentColor: "#aaccff",
        glowColor: "#ffffff"
    },
    torii: {
        image: `${base}backgrounds/torii.jpg`,
        effectType: "embers",
        accentColor: "#ff2200",
        glowColor: "#ff4400"
    },
    castle2: {
        image: `${base}backgrounds/rockfort.jpg`,
        effectType: "mist",
        accentColor: "#aabbdd",
        glowColor: "#ccddf0"
    },
    pagoda2: {
        image: `${base}backgrounds/shaolin.jpg`,
        effectType: "mist",
        accentColor: "#44bb44",
        glowColor: "#ff6633"
    },
    barracks: {
        image: `${base}backgrounds/barracks.jpg`,
        effectType: "dust",
        accentColor: "#aa7733",
        glowColor: "#cc9944"
    },
    palace: {
        image: `${base}backgrounds/palace.jpg`,
        effectType: "sparks",
        accentColor: "#ffdd88",
        glowColor: "#ffcc44"
    },
    shrine: {
        image: `${base}backgrounds/shrine.jpg`,
        effectType: "mist",
        accentColor: "#ff6633",
        glowColor: "#ff4400"
    },
    deadforest: {
        image: `${base}backgrounds/deadforest.jpg`,
        effectType: "snow",
        accentColor: "#aabbcc",
        glowColor: "#ddeeff"
    },
    temple: {
        image: `${base}backgrounds/saintbasil.jpg`,
        effectType: "sparks",
        accentColor: "#ffcc44",
        glowColor: "#ffdd88"
    },
    archway: {
        image: `${base}backgrounds/archway.jpg`,
        effectType: "mist",
        accentColor: "#ddccbb",
        glowColor: "#ffffff"
    },
    necro: {
        image: `${base}backgrounds/necropolis.jpg`,
        effectType: "mist",
        accentColor: "#ffcc44",
        glowColor: "#ffaa00"
    },
    cemetery: {
        image: `${base}backgrounds/cemetery.jpg`,
        effectType: "mist",
        accentColor: "#44aa44",
        glowColor: "#226622"
    },
    pillars: {
        image: `${base}backgrounds/pillars.jpg`,
        effectType: "sparks",
        accentColor: "#44aaff",
        glowColor: "#0088ff"
    }
}

/**
 * Safely resolves background configuration for any land ID.
 * Returns default fallback if the land ID is unmapped or missing.
 */
export function getLandBackground(landId) {
    const config = LAND_BACKGROUNDS[landId]
    if (config) {
        return {
            ...config,
            fallbackImage: DEFAULT_BACKGROUND
        }
    }
    return {
        image: DEFAULT_BACKGROUND,
        fallbackImage: DEFAULT_BACKGROUND,
        effectType: "mist",
        accentColor: "#888888",
        glowColor: "#aaaaaa"
    }
}
