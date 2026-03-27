"use client";

import { useEffect, useRef, useState } from "react";

// Theme configuration for dark mode
const darkThemeVariables = {
  background: "#0c0a09",
  primaryColor: "#1c1917",
  primaryTextColor: "#fafaf9",
  primaryBorderColor: "#57534e",
  lineColor: "#a8a29e",
  secondaryColor: "#292524",
  tertiaryColor: "#0c4a6e",
  clusterBkg: "#1c1917",
  clusterBorder: "#44403c",
  edgeLabelBackground: "#292524",
  nodeTextColor: "#fafaf9",
};

const lightThemeVariables = {
  background: "#ffffff",
  primaryColor: "#dbeafe",
  primaryTextColor: "#111827",
  primaryBorderColor: "#2563eb",
  lineColor: "#1e40af",
  secondaryColor: "#e0f2fe",
  tertiaryColor: "#7dd3fc",
  clusterBkg: "#f1f5f9",
  clusterBorder: "#334155",
  edgeLabelBackground: "#ffffff",
  nodeTextColor: "#111827",
  fontSize: "16px",
};

const flowchartConfig = {
  htmlLabels: true,
  curve: "basis" as const,
  padding: 24,
  nodeSpacing: 60,
  rankSpacing: 70,
  diagramPadding: 20,
  useMaxWidth: true,
};

export function MermaidHydrator() {
  const [mermaidModule, setMermaidModule] = useState<typeof import("mermaid") | null>(null);
  const renderCountRef = useRef(0);

  // Dynamically import mermaid to ensure it loads correctly on client
  useEffect(() => {
    import("mermaid").then((mod) => {
      setMermaidModule(mod);
    });
  }, []);

  useEffect(() => {
    if (!mermaidModule) return;

    const mermaid = mermaidModule.default;

    const initializeMermaid = (isDark: boolean) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        fontFamily: "var(--font-mono)",
        themeVariables: isDark ? darkThemeVariables : lightThemeVariables,
        flowchart: flowchartConfig,
        suppressErrorRendering: true,
      });
    };

    const renderDiagrams = async () => {
      // Find all mermaid elements that haven't been rendered yet
      const elements = document.querySelectorAll("pre.mermaid:not([data-processed])");
      if (elements.length === 0) return;

      // Detect dark mode
      const isDark =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      // Initialize mermaid with current theme
      initializeMermaid(isDark);

      // Render each diagram
      for (const element of elements) {
        try {
          // Get the original mermaid code - either from stored attribute or textContent
          const storedCode = element.getAttribute("data-mermaid-code");
          const code = storedCode || element.textContent || "";

          // Skip empty code
          if (!code.trim()) {
            continue;
          }

          // Store the original code for re-renders (e.g., theme changes)
          if (!storedCode) {
            element.setAttribute("data-mermaid-code", code);
          }

          // Use a unique ID for each render to avoid conflicts
          renderCountRef.current += 1;
          const id = `mermaid-${renderCountRef.current}-${Math.random().toString(36).slice(2, 9)}`;

          const { svg } = await mermaid.render(id, code);

          // Replace the pre element content with the SVG
          element.innerHTML = svg;
          element.setAttribute("data-processed", "true");
          element.classList.add("mermaid-rendered");
        } catch (err) {
          console.error("Mermaid rendering error:", err);
          element.setAttribute("data-processed", "true");
          element.classList.add("mermaid-error");
        }
      }
    };

    // Use requestAnimationFrame to ensure DOM is fully ready
    requestAnimationFrame(() => {
      renderDiagrams();
    });

    // Re-render on theme change
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          // Theme might have changed, re-render diagrams
          const elements = document.querySelectorAll("pre.mermaid[data-processed]");
          elements.forEach((el) => {
            el.removeAttribute("data-processed");
            el.classList.remove("mermaid-rendered", "mermaid-error");
          });
          renderDiagrams();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [mermaidModule]);

  return null;
}
