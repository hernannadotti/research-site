import { processMarkdown } from "@/lib/process-markdown";
import { MermaidHydrator } from "./mermaid-hydrator";

interface MarkdownProps {
  content: string;
}

export async function Markdown({ content }: MarkdownProps) {
  const rendered = await processMarkdown(content);

  return (
    <article className="font-sans">
      {rendered}
      <MermaidHydrator />
    </article>
  );
}
