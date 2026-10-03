# Per-agent profile plan

Status: step 1 done, 2026-10-03.

## Idea

Every policy section lives in this repo. Each section is either assigned to
one or more agents or left unassigned. Each agent gets a rendered profile in
`profiles/`, so anyone can see exactly what that agent is told. The README
links to them.

## Assignments

| Section                    | Pi  | Codex | Claude Code | Copilot |
| -------------------------- | --- | ----- | ----------- | ------- |
| Engineering Rules          | ✓   |       |             |         |
| Delegation                 | ✓   | ✓     | ✓           |         |
| Second Opinions            |     |       |             |         |
| Safety Rules               | ✓   |       |             |         |
| Testing Guidelines         | ✓   | ✓     | ✓           | ✓       |
| Communication Standards    | ✓   | ✓     | ✓           |         |
| TypeScript Guidelines      | ✓   | ✓     | ✓           | ✓       |
| Comment Guidelines         | ✓   | ✓     | ✓           | ✓       |
| Known Performance Pitfalls |     |       |             |         |
| Copilot Rules              |     |       |             | ✓       |
| Workspace (from pi-setup)  | ✓   |       |             |         |

Codex and Claude Code drop Engineering Rules and Safety Rules on the
assumption that their harness prompts already cover them, as Copilot's does.
That assumption is unverified.

## Boundary with pi-setup

agent-policy owns the policy text an agent's main session reads. pi-setup owns
how Pi applies it: hooks, placement, deduplication, child filtering, and the
subagent role prompts, including the child final-message note. Subagent text
stays in pi-setup because it only makes sense inside Pi's role system.

Unassigned sections stay in the source and render to `profiles/opt-in.md`.
They aren't loaded anywhere. You can paste or enable them when needed:

- Second Opinions: useful on request, but costly in tokens and can cause loops.
- Known Performance Pitfalls: worth keeping, but too narrow for a system
  prompt. Revisit if a frontend skill ever exists.

TypeScript Guidelines stay in the prompt for now. They're three bullets, so
a skill would add trigger overhead without saving much context.

## Copilot note for other readers

The README will say that the Copilot profile is tuned for this setup, and that
a general Copilot user would probably also want Delegation and Communication
Standards. That's one sentence, not a second Copilot profile to maintain.

## Steps

Each step is a separate request.

1. **agent-policy: profiles.** Define the assignment table in source and copy
   Pi's Workspace section here. Render
   `profiles/{pi,codex,claude-code,copilot,opt-in}.md`. Add the README table
   and the Copilot note. Leave `policy.md` and the `GLOBAL_*` exports unchanged
   so Pi and config sync see no change yet. The Copilot profile changes now.
2. **pi-setup: use the Pi profile.** In `extensions/shared/engineering-policy.ts`,
   swap `GLOBAL_INSTRUCTION_RULES` and the local Workspace section for the Pi
   profile and the package's Workspace export, which child filtering still
   needs. This drops Second Opinions and Known Performance Pitfalls from Pi. The dedupe key
   (`## Engineering Rules`) is still in the Pi profile. pi-setup links this
   checkout, so building takes effect on this machine. Needs an explicit go.
3. **Config sync: per-agent files.** Point step 7 of `fleet-config-sync` at
   `profiles/claude-code.md` and `profiles/codex.md` instead of `policy.md`.
   Then remove `policy.md` and the `GLOBAL_*` exports. Running the sync across
   the fleet is a separate authorization.

## Notes

- Codex and Claude Code profiles are identical today. They still get one file
  each, one per config-sync target, so each can diverge without restructuring.
