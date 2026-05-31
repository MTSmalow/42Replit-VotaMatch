const colors = {
  light: {
    text: "#0D1B2A",
    tint: "#1A5276",

    background: "#F4F6F5",
    foreground: "#0D1B2A",

    card: "#FFFFFF",
    cardForeground: "#0D1B2A",
    cardDark: "#1A2A3A",

    primary: "#1A5276",
    primaryForeground: "#FFFFFF",

    secondary: "#EAF0F6",
    secondaryForeground: "#1A5276",

    muted: "#ECF0F1",
    mutedForeground: "#7F8C8D",

    accent: "#27AE60",
    accentForeground: "#FFFFFF",

    destructive: "#E74C3C",
    destructiveForeground: "#FFFFFF",

    border: "#DFE6E9",
    input: "#DFE6E9",
    inputBorder: "#E8ECEF",

    // VotaMatch specific
    agree: "#27AE60",
    agreeBg: "#EAFAF1",
    agreeLight: "#E8F8EF",
    disagree: "#E74C3C",
    disagreeBg: "#FDECEA",
    neutral: "#95A5A6",
    matchHigh: "#27AE60",
    matchMid: "#F39C12",
    matchLow: "#95A5A6",

    // Text shades
    textSecondary: "#2C3E50",
    subtitleText: "#5D6D7E",

    // Surface shades
    subtleBg: "#F2F3F4",
    faintBg: "#EEF0F2",
    divider: "#EDF0F2",

    // Warning
    warningBg: "#FEF9E7",
    warningBorder: "#F9CA5B",
    warningText: "#7D6608",

    // Shadows
    shadowColor: "#000000",
  },
  radius: 12,
};

// Flat shorthand — use `C.primary`, `C.agree`, etc.
export const C = colors.light;

export default colors;
