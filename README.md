# agent-policy

Shared policy and agent-specific instruction profiles.

The TypeScript package exports each named policy section and the assembled
`GLOBAL_INSTRUCTION_RULES` string. `policy.md` is the canonical rendered form
used when an agent accepts global Markdown instructions rather than a package.

Agent-specific overlays remain separate from the shared policy. The Copilot
profile is exported as `COPILOT_PROFILE` and rendered at
`profiles/copilot.md`. Integrations still own prompt placement, hooks, tool
wiring, installation, and drift handling. Pi-specific policy remains in
`pi-setup`. [docs/design.md](docs/design.md) defines the ownership boundary.

## Commands

| Task            | Command        |
| --------------- | -------------- |
| Install         | `pnpm install` |
| Render Markdown | `pnpm render`  |
| Test            | `pnpm test`    |
| Typecheck       | `pnpm check`   |
| Build package   | `pnpm build`   |
| Format          | `pnpm format`  |

Edit the relevant source file, run `pnpm render`, and commit both source and
rendered output. Bump the package version when published policy text or exports
change. Consumers should pin a package version or repository revision.
