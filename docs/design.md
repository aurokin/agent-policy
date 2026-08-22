# Design

## Scope

This repo owns behavioral instructions that should remain identical across
coding-agent harnesses. A rule belongs here only when it is useful without
knowing whether Pi, Codex, Claude, or another harness will read it.

Harness-specific tool names, filesystem layout, prompt placement, lifecycle
hooks, and child-session behavior stay with the harness integration.

## Representation

`src/policy.ts` is the source of truth. It exports named sections so consumers
can omit sections that do not apply to a constrained child or profile.
`GLOBAL_INSTRUCTION_RULES` joins every section in distribution order.

`policy.md` is generated because Codex and Claude accept global Markdown
instructions. Its bytes must equal `GLOBAL_INSTRUCTION_RULES` plus one trailing
newline. The parity test protects fleet drift detection from false changes.

## Rule selection

Keep the set focused. Add a rule when capable models otherwise make the same
costly mistake and when a tool schema or harness instruction cannot express it
more precisely. Use as many sentences as the idea needs instead of compressing
several obligations into one dense bullet.

The orchestration and second-opinion sections describe capabilities
conditionally. Names such as `rubber-duck`, `advisor`, and `consult` are shared
policy vocabulary; each harness decides which mechanisms it implements.

## Consumers

- `pi-setup` imports the package and adds Pi workspace guidance, prompt
  placement, fixups, and child-role filtering.
- `fleet-config-sync` reads `policy.md`, stamps the agent-policy commit, and
  updates managed blocks in Codex and Claude global instruction files.
- Live global instruction files are deployment targets, never policy sources.

The dependency direction is always from a harness or deployment tool to this
package. This package must not import a harness integration.
