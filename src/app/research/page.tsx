import { Markdown } from "@/components/markdown";
import { decisionsContent } from "@/content/decisions";

export default async function ResearchPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Markdown content={decisionsContent} />
    </main>
  );
}
