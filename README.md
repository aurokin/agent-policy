# agent-policy

System prompts for the coding agents I use. Every section lives here and is
either assigned to agents or kept as opt-in.

## Profiles

Each profile is rendered to Markdown so you can read exactly what that agent is
told.

| Section                 | [Pi](profiles/pi.md) | [Codex](profiles/codex.md) | [Claude Code](profiles/claude-code.md) | [Copilot](profiles/copilot.md) |
| ----------------------- | -------------------- | -------------------------- | -------------------------------------- | ------------------------------ |
| Engineering Rules       | ✓                    |                            |                                        |                                |
| Delegation              | ✓                    | ✓                          | ✓                                      |                                |
| Safety Rules            | ✓                    |                            |                                        |                                |
| Testing Guidelines      | ✓                    | ✓                          | ✓                                      | ✓                              |
| Communication Standards | ✓                    | ✓                          | ✓                                      |                                |
| TypeScript Guidelines   | ✓                    | ✓                          | ✓                                      | ✓                              |
| Comment Guidelines      | ✓                    | ✓                          | ✓                                      | ✓                              |
| Workspace               | ✓                    |                            |                                        |                                |
| Copilot rules           |                      |                            |                                        | ✓                              |

The Pi profile is specific to my
[pi-setup](https://github.com/aurokin/pi-setup), which composes it into Pi's
prompt.

The Copilot profile is tuned for my own setup. If you are adapting it, you
probably also want Delegation and Communication Standards from the Codex
profile.

[Opt-in sections](profiles/opt-in.md) are kept but not loaded anywhere: Second
Opinions, which I enable on request, and Known Performance Pitfalls.

## Export

`pnpm export <claude-code|codex|copilot>` shows how this host's global
instructions file would change; add `--write` to apply it. Only the text
between the managed markers changes. The `export-policy` project skill walks an
agent through it.

To tune a profile on one host, flip sections in
`~/.config/agent-policy/config.json`, using the names in
[src/profiles.ts](src/profiles.ts):

```json
{ "claude-code": { "second-opinions": true } }
```

Pi isn't exported; pi-setup imports `PI_PROFILE` directly.

The TypeScript package exports each section and profile. Integrations own
prompt placement, hooks, tool wiring, installation, and drift handling.
[docs/design.md](docs/design.md) defines the ownership boundary.

## Commands

| Task            | Command        |
| --------------- | -------------- |
| Install         | `pnpm install` |
| Render Markdown | `pnpm render`  |
| Test            | `pnpm test`    |
| Typecheck       | `pnpm check`   |
| Build package   | `pnpm build`   |
| Format          | `pnpm format`  |
| Export profile  | `pnpm export`  |

Edit the relevant source file, run `pnpm render`, and commit both source and
rendered output. Bump the package version when published policy text or exports
change. Consumers should pin a package version or repository revision.
