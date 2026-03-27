import { Markdown } from "@/components/markdown";
import { findingsContent } from "@/content/findings";

export default async function FindingsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Markdown content={findingsContent} />
    </main>
  );
}
