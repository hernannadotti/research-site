export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <article className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:py-24">
        {/* Header */}
        <header className="mb-12">
          <div className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Research &middot; AI Security &middot; Sandbox Environments
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            Securing AI Agent Execution: A Three-Context Isolation Model with Daytona Cloud Sandboxes
          </h1>
          <p className="text-xl leading-8 text-zinc-600 dark:text-zinc-400">
            Why running LLM-generated code without isolation is a structural risk—and how to fix it.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          {/* The Problem */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              The Problem: AI Agents Share Too Much
            </h2>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300 leading-7">
              Running AI agents and LLM-generated code in shared execution environments—a developer&apos;s laptop, a CI server, or a shared container—creates a structural security risk: the agent&apos;s orchestration logic, its secrets, and the code it produces all share the same execution context.
            </p>
            <p className="mb-6 text-zinc-700 dark:text-zinc-300 leading-7">
              The threats are real and documented:
            </p>
            <ul className="mb-6 space-y-3 text-zinc-700 dark:text-zinc-300">
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Secret exposure:</strong> Generated code runs with full access to host environment variables, including API keys, database passwords, and cloud credentials.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Prompt injection:</strong> Attackers embed hidden instructions in content the agent processes—OpenAI confirmed in late 2025 that this cannot be fully solved at the model level.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Memory poisoning:</strong> Research from late 2025 showed 87% of downstream decisions were affected within four hours of an initial injection.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Data exfiltration:</strong> The Slack AI incident (2024) demonstrated conversation data exfiltration via indirect prompt injections with no egress controls in place.</span>
              </li>
            </ul>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                <strong>Key insight:</strong> Wrapping both the agent harness and generated code in a single container protects the broader environment, but the harness&apos;s secrets remain accessible to the generated code running inside the same box.
              </p>
            </div>
          </section>

          {/* The Solution */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              The Solution: Three-Context Isolation Model
            </h2>
            <p className="mb-6 text-zinc-700 dark:text-zinc-300 leading-7">
              We evaluated Local Dev Containers (Docker) against Daytona Cloud Sandboxes as the primary execution environment for agent-generated code. The decision: adopt Daytona with a Three-Context Isolation Model.
            </p>

            {/* Architecture Diagram */}
            <div className="mb-6 rounded-lg bg-zinc-900 p-6 font-mono text-sm text-zinc-100 overflow-x-auto">
              <pre className="whitespace-pre">{`Context A — Agent Harness
  Orchestration + LLM calls
  Holds secrets (never forwarded)
  Runs on: serverless function
         │
         │ tool invocation
         ▼
Context B — Secret Injection Proxy
  Injects credentials as headers
  Overwrites sandbox-set headers
  Logs all credential usage
         │
         │ execution dispatch
         ▼
Context C — Sandbox (Daytona)
  Runs AI-generated code
  No direct secret access
  Allowlist-only egress
  Checkpoints before risky ops`}</pre>
            </div>

            <p className="mb-4 text-zinc-700 dark:text-zinc-300 leading-7">
              <strong>Key invariant:</strong> Context C has no network path to Context A&apos;s secrets. All interfaces between contexts are explicit and logged.
            </p>
          </section>

          {/* Core Isolation Principles */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Core Isolation Principles
            </h2>
            <p className="mb-6 text-zinc-700 dark:text-zinc-300 leading-7">
              Three rules that must hold for any agent workload—regardless of platform choice:
            </p>
            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">1. Harness and generated code run in separate VMs</h3>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm">No shared process space, no shared filesystem, no shared network namespace.</p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">2. Secrets never enter the sandbox</h3>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm">Credentials are injected at the network layer by a proxy—never stored as env vars inside the sandbox.</p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">3. Outbound network is allowlisted, not blocklisted</h3>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm">The sandbox has zero egress by default; destinations are explicitly declared.</p>
              </div>
            </div>
            <div className="mt-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-950">
              <p className="text-red-800 dark:text-red-200 font-medium">
                Running generated code without isolation is not a configuration gap—it is a structural risk.
              </p>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Why Daytona Over Local Containers?
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-3 pr-4 text-left font-semibold text-zinc-900 dark:text-zinc-100">Concern</th>
                    <th className="py-3 pr-4 text-left font-semibold text-zinc-900 dark:text-zinc-100">Local Docker</th>
                    <th className="py-3 text-left font-semibold text-zinc-900 dark:text-zinc-100">Daytona</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-700 dark:text-zinc-300">
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4 font-medium">Startup time</td>
                    <td className="py-3 pr-4">~1–2s</td>
                    <td className="py-3 text-green-600 dark:text-green-400">~90ms</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4 font-medium">Host isolation</td>
                    <td className="py-3 pr-4">Partial—shares kernel</td>
                    <td className="py-3 text-green-600 dark:text-green-400">Full—no host access</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4 font-medium">Secret exposure</td>
                    <td className="py-3 pr-4 text-red-600 dark:text-red-400">High—env vars leak</td>
                    <td className="py-3 text-green-600 dark:text-green-400">Low—proxy injection</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4 font-medium">Network egress</td>
                    <td className="py-3 pr-4">Manual iptables</td>
                    <td className="py-3 text-green-600 dark:text-green-400">Built-in policies</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4 font-medium">Checkpoints</td>
                    <td className="py-3 pr-4 text-red-600 dark:text-red-400">Not available</td>
                    <td className="py-3 text-green-600 dark:text-green-400">First-class API</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4 font-medium">Cloud metadata</td>
                    <td className="py-3 pr-4 text-red-600 dark:text-red-400">Exposed by default</td>
                    <td className="py-3 text-green-600 dark:text-green-400">Blocked by default</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium">CI/CD integration</td>
                    <td className="py-3 pr-4">Privileged mode</td>
                    <td className="py-3 text-green-600 dark:text-green-400">API-driven</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Two-Agent Model */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Daytona&apos;s Two-Agent Model
            </h2>
            <p className="mb-6 text-zinc-700 dark:text-zinc-300 leading-7">
              Daytona ships with the Claude Agent SDK pre-installed inside the sandbox. This isn&apos;t a violation of isolation principles—it reflects a two-agent architecture:
            </p>

            <div className="mb-6 rounded-lg bg-zinc-900 p-6 font-mono text-sm text-zinc-100 overflow-x-auto">
              <pre className="whitespace-pre">{`Project Manager Agent — EXTERNAL (local / serverless)
  High-level planning and orchestration
  Holds primary infrastructure secrets
  Uses base Anthropic API
         │
         ▼
Developer Agent — INSIDE Daytona Sandbox
  Claude Agent SDK installed here
  Executes coding, automation, tool use
  Has its own scoped SANDBOX_ANTHROPIC_API_KEY
  No access to external secrets`}</pre>
            </div>

            <p className="mb-4 text-zinc-700 dark:text-zinc-300 leading-7">
              The sandbox runs a <strong>subordinate agent</strong> with its own scoped API key, not the orchestrator that holds infrastructure credentials. The isolation principle holds as long as:
            </p>
            <ul className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
              <li>• The Developer Agent has a separate, scoped API key</li>
              <li>• Infrastructure secrets are never passed into the sandbox</li>
              <li>• The Project Manager Agent retains control over task dispatch</li>
            </ul>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>The right question:</strong> Not &quot;should the SDK be in the sandbox?&quot; but <em>&quot;what level of autonomy and what scoped credentials does the in-sandbox agent get?&quot;</em>—that defines the security posture.
              </p>
            </div>
          </section>

          {/* Checkpoint Strategy */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Checkpoint Strategy
            </h2>
            <p className="mb-6 text-zinc-700 dark:text-zinc-300 leading-7">
              Not all state belongs in the sandbox. Clear ownership per state type:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-3 pr-4 text-left font-semibold text-zinc-900 dark:text-zinc-100">State Type</th>
                    <th className="py-3 pr-4 text-left font-semibold text-zinc-900 dark:text-zinc-100">Where It Lives</th>
                    <th className="py-3 text-left font-semibold text-zinc-900 dark:text-zinc-100">Strategy</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-700 dark:text-zinc-300">
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4">Agent harness config</td>
                    <td className="py-3 pr-4">Version control</td>
                    <td className="py-3">Git—never in sandbox</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4">Generated code output</td>
                    <td className="py-3 pr-4">Sandbox filesystem</td>
                    <td className="py-3">Snapshot before/after</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4">Task progress/memory</td>
                    <td className="py-3 pr-4">External store</td>
                    <td className="py-3">Never inside sandbox</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Secrets</td>
                    <td className="py-3 pr-4">Secrets manager</td>
                    <td className="py-3">Never persisted in sandbox</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Limitations */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              What This Architecture Cannot Solve
            </h2>
            <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
              <li className="flex gap-3">
                <span className="text-zinc-400">•</span>
                <span><strong>Prompt injection at the model level</strong>—no sandbox can eliminate it; mitigated via summarization firewalls and security-aware system prompts.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-400">•</span>
                <span><strong>Model unpredictability</strong>—hallucinations in tool use decisions are reduced through output sanitization but cannot be fully eliminated.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-400">•</span>
                <span><strong>Egress allowlist maintenance</strong>—requires explicit review whenever dependencies evolve; not set-and-forget.</span>
              </li>
            </ul>
          </section>

          {/* Conclusion */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Conclusion
            </h2>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300 leading-7">
              The Three-Context Isolation Model with Daytona Cloud Sandboxes structurally eliminates credential theft, limits the blast radius of prompt injection attacks, and provides reproducible, auditable execution for AI agent workloads.
            </p>
            <p className="text-zinc-700 dark:text-zinc-300 leading-7">
              Local Dev Containers remain valid for trusted, first-party code in development—but they are <strong>not appropriate</strong> for production agent workloads or any execution of LLM-generated code.
            </p>
          </section>

          {/* Footer */}
          <footer className="border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Based on research conducted for Nybble LABS&apos;s AI SDLC initiative.
            </p>
          </footer>
        </div>
      </article>
    </div>
  );
}
