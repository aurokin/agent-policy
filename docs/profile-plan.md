# Policy export plan

Status: done, 2026-10-03. Exported on every dev host except haste, which was
offline.

Per-agent profiles are done; the README shows what each agent gets. This plan
covers exporting them to the current host.

## Pi

Pi's profile is specific to my pi-setup. pi-setup imports `PI_PROFILE` and owns
placement and child filtering. Pi has no export step and no overrides.

## Flags

Each section gets a short name, such as `second-opinions` or `typescript`.
Codex, Claude Code, and Copilot each have a default on/off flag per section.
The defaults render to `profiles/` and the README table, which is what other
readers see. Sections keep one fixed order, so flipping a flag never reorders
the others.

A host can override defaults in `~/.config/agent-policy/config.json`:

```json
{ "claude-code": { "second-opinions": true } }
```

Unknown agents or section names are errors. fleet-config-sync syncs this file
from `~/.dotfiles-private/intent` like any other tool config, so fleet-wide
and per-host overrides use its existing intent rules.

## Export

`pnpm export <codex|claude-code|copilot>` shows what would change on this host.
With `--write`, it backs up the target, replaces the text between the existing
markers, appends a block if none exists, and skips symlinked targets. Marker
lines are kept as they are. Drift and revision handling are out of scope here
and are being reworked separately.

| Agent       | Target                               |
| ----------- | ------------------------------------ |
| Claude Code | `~/.claude/CLAUDE.md`                |
| Codex       | `~/.codex/AGENTS.md`                 |
| Copilot     | `~/.copilot/copilot-instructions.md` |

## Skill

One project skill, `export-policy`, in `.agents/skills/` with a symlink from
`.claude/skills/`. It says which agent to pass, to show the diff first, and to
run `--write` only after the user confirms.

## fleet-config-sync

Its job is syncing config. It adds `~/.config/agent-policy/config.json` to its
tool table, and step 7 becomes: on each host, follow agent-policy's
`export-policy` skill.

## Steps

Each step is a separate request.

1. **Section names and defaults.** Express profiles as flags. Rendered output
   stays byte-identical.
2. **Export.** Add the override config, `pnpm export`, the skill, and README
   notes.
3. **fleet-config-sync.** Add the config row and replace step 7.
4. **Run it on koopa.** Separate go-ahead.

## Verified

GitHub's Copilot CLI docs list `~/.copilot/copilot-instructions.md` as the
user-level instructions file and `.github/skills/`, `.agents/skills/`, and
`.claude/skills/` as project skill locations.
