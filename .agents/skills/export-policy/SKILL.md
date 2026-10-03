---
name: export-policy
description: Export this repo's Claude Code, Codex, or Copilot policy profile into the current host's global instructions file. Use when asked to install, export, apply, or update the agent policy on this machine. Pi is not exported; pi-setup composes its profile.
---

# Export policy

Run from the agent-policy checkout after `pnpm install`.

| Agent       | Command                   | Target                               |
| ----------- | ------------------------- | ------------------------------------ |
| Claude Code | `pnpm export claude-code` | `~/.claude/CLAUDE.md`                |
| Codex       | `pnpm export codex`       | `~/.codex/AGENTS.md`                 |
| Copilot     | `pnpm export copilot`     | `~/.copilot/copilot-instructions.md` |

1. Run the command without flags. It prints a diff and writes nothing.
2. Show the user the diff summary: which sections are added or removed.
3. Only after the user confirms, run the same command with `--write`. It backs
   up the target to `<file>.bak-<timestamp>` and replaces only the text between
   the `fleet-config-sync:engineering-rules` markers. Content outside the
   markers is never touched. A file without markers gets a block appended.

The script refuses symlinked targets and agents whose config directory does not
exist. Report those to the user instead of working around them.

Host overrides live in `~/.config/agent-policy/config.json`. Section names are
in `src/profiles.ts`:

```json
{ "claude-code": { "second-opinions": true, "testing": false } }
```

Edit that file only when the user asks. Unknown agents or section names make
the export fail.
