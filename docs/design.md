# Design

## Scope

This repo owns shared behavioral instructions and selected agent-specific
instruction overlays. Shared rules remain useful without knowing whether Pi,
Codex, Claude, Copilot, or another agent will read them. Agent-specific rules
must remain isolated from the shared policy and from other agents' profiles.

Integrations still own filesystem layout, prompt placement, lifecycle hooks,
tool wiring, and child-session implementation. A dedicated integration may
also keep its own agent-specific policy, as Pi does.

## Representation

`src/policy.ts` is the source of truth. It exports named sections so consumers
can omit sections that do not apply to a constrained child or profile.
`GLOBAL_INSTRUCTION_RULES` joins every section in distribution order.

Agent overlays live in files named for their target, such as `src/copilot.ts`.
`src/profiles.ts` explicitly composes shared sections with each overlay.
Explicit profiles make it difficult to include one agent's rules in another
agent's instructions by accident.

`policy.md` is generated because Codex and Claude accept global Markdown
instructions. Its bytes must equal `GLOBAL_INSTRUCTION_RULES` plus one trailing
newline. The parity test protects fleet drift detection from false changes.

Rendered agent profiles live under `profiles/`. Each file must equal its
TypeScript profile export plus one trailing newline.

## Rule selection

Keep the set focused. Add a rule when capable models otherwise make the same
costly mistake and when a tool schema or harness instruction cannot express it
more precisely. Use as many sentences as the idea needs instead of compressing
several obligations into one dense bullet.

The delegation and second-opinion sections describe capabilities
conditionally. Names such as `rubber-duck`, `advisor`, and `consult` are shared
policy vocabulary; each integration decides which mechanisms it implements.

An agent-specific rule belongs in an overlay when it depends on that agent's
tools, defaults, or product behavior. Do not add it to
`GLOBAL_INSTRUCTION_SECTIONS`.

## Consumers

- `pi-setup` imports the package and adds Pi workspace guidance, prompt
  placement, fixups, and child-role filtering.
- `fleet-config-sync` reads `policy.md`, stamps the agent-policy commit, and
  updates managed blocks in Codex and Claude global instruction files.
- Copilot consumers can read `profiles/copilot.md` or import
  `COPILOT_PROFILE`.
- Live global instruction files are deployment targets, never policy sources.

The dependency direction is always from an integration or deployment tool to
this package. This package must not import an integration.
