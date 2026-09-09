import React, { createContext, useContext, useState, useEffect } from "react";
import { UITheme, DEFAULT_THEME } from "../components/panels/UICustomizer";

interface ThemeContextValue {
  theme: UITheme;
  setTheme: (t: UITheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<UITheme>(() => {
    try {
      const stored = localStorage.getItem("nereus_theme");
      return stored ? JSON.parse(stored) : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const setTheme = (t: UITheme) => {
    setThemeState(t);
    localStorage.setItem("nereus_theme", JSON.stringify(t));
  };

  // Inject CSS variables on every theme change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-cyan", theme.accentCyan);
    root.style.setProperty("--color-teal", theme.accentTeal);
    root.style.setProperty("--color-amber", theme.accentAmber);
    root.style.setProperty("--color-danger", theme.accentDanger);
    root.style.setProperty("--color-text-primary", theme.textPrimary);
    root.style.setProperty("--color-text-secondary", theme.textSecondary);
    root.style.setProperty("--color-text-mono", theme.textMono);
    root.style.setProperty("--panel-bg-opacity", (theme.panelBgOpacity / 100).toFixed(2));
    root.style.setProperty("--panel-blur", `${theme.panelBlur}px`);
    root.style.setProperty("--panel-border-opacity", (theme.panelBorderOpacity / 100).toFixed(2));
    root.style.setProperty("--panel-border-color", theme.panelBorderColor);
    root.style.setProperty("--glow-intensity", (theme.glowIntensity / 100).toFixed(2));

    // Body background
    const body = document.body;
    body.style.color = theme.textPrimary;

    // Background
    if (theme.bgCustomImage) {
      body.style.backgroundImage = `url(${theme.bgCustomImage})`;
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center";
      body.style.filter = theme.bgBlur > 0 ? `blur(${theme.bgBlur}px)` : "";
      body.style.backgroundColor = theme.bgColor;
    } else {
      body.style.backgroundImage = theme.bgGradient !== "none" ? theme.bgGradient : "";
      body.style.backgroundColor = theme.bgColor;
      body.style.filter = "";
    }

    // Font heading
    const fontMap: Record<string, string> = {
      chakra: "'Chakra Petch', sans-serif",
      jetbrains: "'JetBrains Mono', monospace",
      inter: "'Inter', sans-serif",
      orbitron: "'Orbitron', sans-serif",
      exo: "'Exo 2', sans-serif",
    };
    root.style.setProperty("--font-heading", fontMap[theme.fontHeading] || fontMap.chakra);

    // Animation speed
    const speedMap = { off: "0s", slow: "2s", normal: "1s", fast: "0.4s" };
    root.style.setProperty("--anim-speed-mult", speedMap[theme.animationSpeed] || "1s");

    // HUD scale
    root.style.setProperty("--hud-scale", (theme.hudScale / 100).toFixed(2));

    // Starfield
    if (theme.bgStarfield) {
      root.classList.add("theme-starfield");
    } else {
      root.classList.remove("theme-starfield");
    }

    // Animated waves
    if (theme.bgAnimatedWaves) {
      root.classList.add("theme-waves");
    } else {
      root.classList.remove("theme-waves");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
