export const decisionsContent = `# Decisions: How to Run on Sandboxes Environments

## Context

Running AI-generated code safely requires robust isolation mechanisms. After evaluating multiple approaches, we've decided to implement a **three-context isolation model** that provides security at multiple layers.

## Architecture Overview

\`\`\`
+------------------------------------------------------------+
|  HOST SYSTEM                                               |
|  +------------------------------------------------------+  |
|  |  CONTAINER RUNTIME                                   |  |
|  |  +--------------------+      +--------------------+  |  |
|  |  |   Sandbox Context  |      |   Sandbox Context  |  |  |
|  |  |   +- Process       |      |   +- Process       |  |  |
|  |  |   |  Isolation     |      |   |  Isolation     |  |  |
|  |  |   +- File System   |      |   +- File System   |  |  |
|  |  |      (Ephemeral)   |      |      (Ephemeral)   |  |  |
|  |  +--------------------+      +--------------------+  |  |
|  +------------------------------------------------------+  |
+------------------------------------------------------------+
\`\`\`

## Configuration

The sandbox environment is configured using the following YAML structure:

\`\`\`yaml
sandbox:
  runtime: "container"
  isolation:
    level: "strict"
    network:
      egress: "restricted"
      ingress: "deny"
    filesystem:
      mode: "ephemeral"
      persist_paths:
        - "/workspace"
        - "/home/user/.cache"
  resources:
    cpu: "2"
    memory: "4Gi"
    timeout: "10m"
  capabilities:
    - "NET_BIND_SERVICE"
  security_context:
    run_as_non_root: true
    read_only_root_filesystem: true
\`\`\`

## Decision Matrix

| Approach | Security | Performance | Complexity | Chosen |
|----------|----------|-------------|------------|--------|
| VM-based isolation | High | Low | High | No |
| Container isolation | Medium-High | High | Medium | **Yes** |
| Process sandboxing | Medium | Very High | Low | Partial |
| WASM runtime | High | Medium | Medium | Future |

## Rationale

We chose container-based isolation with additional process sandboxing for the following reasons:

1. **Balance of Security and Performance**
   - Container namespaces provide strong isolation
   - Minimal overhead compared to full VMs
   - Allows for quick startup times (~200ms)

2. **Ecosystem Compatibility**
   - Works with standard development tools
   - Supports multiple languages and runtimes
   - Easy integration with CI/CD pipelines

3. **Operational Simplicity**
   - Well-understood deployment model
   - Extensive tooling available
   - Strong community support

## Consequences

### Positive Consequences

- Fast sandbox creation and teardown
- Predictable resource allocation
- Strong isolation between sandboxes
- Audit trail through container logs

### Negative Consequences

- Requires container runtime on host
- Some kernel-level operations not possible
- Cold start latency for new images

### Mitigations

> **Note:** To mitigate cold start latency, we maintain a pool of pre-warmed containers that can be assigned to incoming requests within milliseconds.

## Implementation Notes

The implementation follows these key principles:

- **Least Privilege**: Sandboxes run with minimal permissions
- **Defense in Depth**: Multiple isolation layers protect against escapes
- **Fail Secure**: Errors result in termination, not degraded security

## References

- [Container Security Best Practices](https://example.com/container-security)
- [Sandbox Architecture RFC](https://example.com/sandbox-rfc)
- [Performance Benchmarks](https://example.com/benchmarks)
`;
