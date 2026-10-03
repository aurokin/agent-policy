# Design

## Scope

This repo owns the policy text each agent's main session reads. Every section
is either assigned to one or more agent profiles or kept as opt-in. Shared
sections remain useful without knowing whether Pi, Codex, Claude, Copilot, or
another agent will read them. Agent-specific rules must remain isolated from
the shared policy and from other agents' profiles.

Integrations still own filesystem layout, prompt placement, lifecycle hooks,
tool wiring, and child-session implementation. Pi's subagent role prompts stay
in `pi-setup` because they only make sense inside Pi's role system.

## Representation

`src/policy.ts` is the source of truth. It exports named sections so consumers
can omit sections that do not apply to a constrained child or profile.

Agent overlays live in files named for their target, such as `src/copilot.ts`
and `src/pi.ts`. `src/profiles.ts` explicitly lists each profile's sections and
the opt-in sections. Explicit profiles make it difficult to include one agent's rules in another
agent's instructions by accident.

Rendered agent profiles and the opt-in sections live under `profiles/`. Each
file must equal its TypeScript export plus one trailing newline. The parity
test protects fleet drift detection from false changes.

## Rule selection

Keep the set focused. Add a rule when capable models otherwise make the same
costly mistake and when a tool schema or harness instruction cannot express it
more precisely. Use as many sentences as the idea needs instead of compressing
several obligations into one dense bullet.

The delegation and second-opinion sections describe capabilities
conditionally. Names such as `rubber-duck`, `advisor`, and `consult` are shared
policy vocabulary; each integration decides which mechanisms it implements.

An agent-specific rule belongs in an overlay when it depends on that agent's
tools, defaults, or product behavior. Add it only to that agent's profile.

## Consumers

- `pi-setup` imports `PI_PROFILE` and adds prompt placement, fixups, and
  child-role filtering.
- `fleet-config-sync` syncs `~/.config/agent-policy/config.json` from intent
  and runs `pnpm export` on each host.
- `pnpm export` writes the Claude Code, Codex, or Copilot profile, with host
  overrides from `~/.config/agent-policy/config.json`, into that agent's
  global instructions file on the current host.
- Copilot consumers can read `profiles/copilot.md` or import `COPILOT_PROFILE`.
- Live global instruction files are deployment targets, never policy sources.

The dependency direction is always from an integration or deployment tool to
this package. This package must not import an integration.
