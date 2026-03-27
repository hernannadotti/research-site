import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeMermaid from "rehype-mermaid";
import rehypeReact from "rehype-react";
import * as prod from "react/jsx-runtime";
import type { Components } from "rehype-react";
import type { ReactElement } from "react";

// Production JSX runtime for rehype-react
const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

// Theme CSS variables for Mermaid diagrams
// These allow diagrams to respond to dark/light mode via CSS
const mermaidCss = `
  .mermaid-svg {
    --mermaid-bg: var(--color-stone-50, #fafaf9);
    --mermaid-node-bg: var(--color-stone-100, #f5f5f4);
    --mermaid-node-border: var(--color-stone-400, #a8a29e);
    --mermaid-text: var(--color-stone-800, #292524);
    --mermaid-line: var(--color-stone-500, #78716c);
    --mermaid-label-bg: var(--color-stone-50, #fafaf9);
  }

  :root.dark .mermaid-svg,
  .dark .mermaid-svg {
    --mermaid-bg: var(--color-stone-900, #1c1917);
    --mermaid-node-bg: var(--color-stone-800, #292524);
    --mermaid-node-border: var(--color-stone-600, #57534e);
    --mermaid-text: var(--color-stone-200, #e7e5e4);
    --mermaid-line: var(--color-stone-400, #a8a29e);
    --mermaid-label-bg: var(--color-stone-800, #292524);
  }
`;

// Detect if content contains ASCII box-drawing characters
function isAsciiDiagram(text: string): boolean {
  const boxChars = /[─│┌┐└┘├┤┬┴┼╔╗╚╝║═╠╣╦╩╬┃━┏┓┗┛┣┫┳┻╋▀▄█▌▐░▒▓■□▪▫●○◆◇◊\-+|]/;
  const lines = text.split("\n");
  const linesWithBoxChars = lines.filter((line) => boxChars.test(line)).length;
  return linesWithBoxChars >= 2;
}

// Extract text content from React nodes
function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    const element = node as { props?: { children?: React.ReactNode } };
    return getTextContent(element.props?.children);
  }
  return "";
}

// Custom components for rehype-react
const components: Partial<Components> = {
  h1: ({ children }) => (
    <h1 className="font-mono text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight mt-8 mb-6 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-mono text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight mt-12 mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-mono text-xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight mt-8 mb-3">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-mono text-lg font-semibold text-stone-900 dark:text-stone-100 tracking-tight mt-6 mb-2">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-stone-700 dark:text-stone-300 leading-relaxed my-4">
      {children}
    </p>
  ),
  pre: ({ children, className }) => {
    // Check if this is a mermaid diagram (pre-mermaid strategy adds class="mermaid")
    if (className?.includes("mermaid")) {
      return (
        <pre className="mermaid mermaid-container my-6 flex justify-center overflow-x-auto p-6 rounded-xl border border-stone-200/50 dark:border-stone-700/50 bg-stone-50/30 dark:bg-stone-900/30 font-mono text-sm text-stone-800 dark:text-stone-200">
          {children}
        </pre>
      );
    }

    // Extract text content to check for ASCII diagrams
    const textContent = getTextContent(children);
    const isAscii = isAsciiDiagram(textContent);

    return (
      <pre
        className={`bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4 overflow-x-auto my-6 ${
          isAscii ? "ascii-diagram" : ""
        }`}
      >
        {children}
      </pre>
    );
  },
  code: ({ className, children }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="font-mono text-sm bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 rounded text-stone-800 dark:text-stone-200">
          {children}
        </code>
      );
    }
    return (
      <code className="font-mono text-sm text-stone-800 dark:text-stone-200">
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 border border-stone-200 dark:border-stone-800 rounded-lg">
      <table className="w-full font-mono text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300 border-t border-stone-100 dark:border-stone-800/50">
      {children}
    </td>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-stone-100 dark:divide-stone-800/50">
      {children}
    </tbody>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 my-6 italic text-stone-600 dark:text-stone-400">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-sky-600 dark:text-sky-400 underline decoration-sky-600/30 dark:decoration-sky-400/30 underline-offset-2 hover:decoration-sky-600 dark:hover:decoration-sky-400 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  hr: () => (
    <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-stone-300 dark:via-stone-700 to-transparent" />
  ),
  ul: ({ children }) => (
    <ul className="my-4 ml-4 space-y-2 list-none">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-4 space-y-2 list-decimal list-inside marker:text-stone-400 dark:marker:text-stone-600 marker:font-mono">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-stone-700 dark:text-stone-300 leading-relaxed pl-2 relative before:content-['—'] before:absolute before:-left-4 before:text-stone-400 dark:before:text-stone-600">
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-stone-900 dark:text-stone-100">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-stone-600 dark:text-stone-400">{children}</em>
  ),
  // Style SVG containers from mermaid diagrams
  figure: ({ className, children }) => {
    if (className?.includes("mermaid")) {
      return (
        <figure className="mermaid-container my-6 flex justify-center overflow-x-auto p-6 rounded-xl border border-stone-200/50 dark:border-stone-700/50 bg-stone-50/30 dark:bg-stone-900/30">
          {children}
        </figure>
      );
    }
    return <figure className={className}>{children}</figure>;
  },
};

// Create the unified processor
// Using pre-mermaid strategy for Turbopack compatibility
// Client-side hydration will render the actual diagrams
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeMermaid, {
    strategy: "pre-mermaid",
  })
  .use(rehypeReact, {
    ...production,
    components,
  });

export async function processMarkdown(content: string): Promise<ReactElement> {
  const file = await processor.process(content);
  return file.result as ReactElement;
}

// Export CSS for mermaid theming
export { mermaidCss };
