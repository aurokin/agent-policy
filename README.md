# agent-policy

Portable policy shared by coding-agent harnesses.

The TypeScript package exports each named policy section and the assembled
`GLOBAL_INSTRUCTION_RULES` string. `policy.md` is the canonical rendered form
used when a harness accepts global Markdown instructions rather than a package.

Harness integrations do not belong here. Pi prompt hooks and subagent behavior
remain in `pi-setup`; fleet installation and drift handling remain in the fleet
skills. [docs/design.md](docs/design.md) defines the ownership boundary.

## Commands

| Task            | Command        |
| --------------- | -------------- |
| Install         | `pnpm install` |
| Render Markdown | `pnpm render`  |
| Test            | `pnpm test`    |
| Typecheck       | `pnpm check`   |
| Build package   | `pnpm build`   |
| Format          | `pnpm format`  |

Edit `src/policy.ts`, run `pnpm render`, and commit both source and rendered
output. Bump the package version when published policy text or exports change.
Consumers should pin a package version or repository revision.
