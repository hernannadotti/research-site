export const findingsContent = `# Findings: How to Run on Sandboxes Environments

## Executive Summary

This document presents our findings from evaluating sandbox environments for executing AI-generated code safely. Our research covered security boundaries, performance characteristics, and operational considerations.

## Key Observations

### Security Boundaries

We identified three critical security boundaries that must be maintained:

| Boundary | Risk Level | Mitigation Status |
|----------|------------|-------------------|
| Host ↔ Container | Critical | Implemented |
| Container ↔ Network | High | Implemented |
| Process ↔ Filesystem | Medium | In Progress |

### Performance Metrics

Our benchmarks revealed the following performance characteristics:

| Operation | P50 Latency | P99 Latency | Throughput |
|-----------|-------------|-------------|------------|
| Sandbox Creation | 180ms | 450ms | 50/sec |
| Code Execution | 12ms | 89ms | 200/sec |
| File Operations | 2ms | 15ms | 1000/sec |
| Network Requests | 45ms | 230ms | 100/sec |

## Checkpoint Flow

The checkpoint mechanism ensures state can be preserved and restored:

\`\`\`
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  START   │────▶│  EXECUTE │────▶│CHECKPOINT│────▶│  RESUME  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     ▼                ▼                ▼                ▼
 Initialize      Run Code         Save State      Restore State
  Sandbox        in Sandbox       to Storage      from Storage
\`\`\`

### State Serialization

\`\`\`javascript
// Checkpoint state structure
const checkpoint = {
  id: "chk_abc123",
  timestamp: Date.now(),
  sandbox_id: "sbx_xyz789",
  state: {
    filesystem: await captureFilesystem(),
    processes: await captureProcesses(),
    environment: process.env,
  },
  metadata: {
    version: "1.0",
    compressed: true,
  }
};

// Restore from checkpoint
async function restore(checkpointId) {
  const checkpoint = await loadCheckpoint(checkpointId);
  const sandbox = await createSandbox();
  await sandbox.applyState(checkpoint.state);
  return sandbox;
}
\`\`\`

## Evidence

### Security Testing Results

> **Finding #1**: Container escape via \`/proc/self/exe\` was blocked by read-only filesystem configuration.

> **Finding #2**: Network exfiltration attempts were caught by egress filtering rules.

> **Finding #3**: Resource exhaustion attacks were mitigated by cgroup limits.

### Load Testing Results

Under sustained load of 100 concurrent sandboxes:

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| CPU Usage | 45% | <70% | Pass |
| Memory Usage | 62% | <80% | Pass |
| Error Rate | 0.02% | <0.1% | Pass |
| Avg Response Time | 156ms | <200ms | Pass |

## Recommendations

Based on our findings, we recommend the following actions:

1. **Immediate Actions**
   - Enable seccomp profiles for all sandboxes
   - Implement rate limiting at the API gateway
   - Add monitoring for anomalous behavior

2. **Short-term Improvements**
   - Implement checkpoint compression
   - Add support for GPU passthrough
   - Create sandbox templates for common use cases

3. **Long-term Considerations**
   - Evaluate WASM-based isolation
   - Investigate hardware security modules
   - Consider multi-region deployment

## Technical Details

### Network Policy

The following network policy is applied to all sandboxes:

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: sandbox-isolation
spec:
  podSelector:
    matchLabels:
      type: sandbox
  policyTypes:
    - Ingress
    - Egress
  egress:
    - to:
        - ipBlock:
            cidr: 10.0.0.0/8
            except:
              - 10.0.0.0/24  # Control plane
      ports:
        - protocol: TCP
          port: 443
\`\`\`

## References

- [Security Audit Report](https://example.com/audit)
- [Performance Test Suite](https://example.com/perf-tests)
- [Incident Response Playbook](https://example.com/playbook)

## Appendix: Raw Data

| Test Run | Date | Sandboxes | Success Rate | Notes |
|----------|------|-----------|--------------|-------|
| TR-001 | 2024-01-15 | 1,000 | 99.9% | Baseline |
| TR-002 | 2024-01-22 | 5,000 | 99.7% | Scale test |
| TR-003 | 2024-02-01 | 10,000 | 99.5% | Stress test |
| TR-004 | 2024-02-15 | 10,000 | 99.8% | After optimization |
`;
