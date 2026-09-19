# Agent instructions

## Commands

| Task          | Command        |
| ------------- | -------------- |
| Install       | `pnpm install` |
| Render policy | `pnpm render`  |
| Test          | `pnpm test`    |
| Typecheck     | `pnpm check`   |
| Build         | `pnpm build`   |
| Format        | `pnpm format`  |

Run `pnpm render` after changing policy source. Commit generated Markdown with
the source change. Run test, typecheck, build, and format before finishing.

## Ownership

- Keep shared policy agent-neutral and isolate agent-specific overlays.
- Put Pi hooks, prompt placement, and subagent integration in `pi-setup`.
- Put fleet installation, revision stamping, and drift handling in fleet skills.
- Preserve named exports when possible so consumers can compose profiles.

## References

| Need                         | File             |
| ---------------------------- | ---------------- |
| Ownership and representation | `docs/design.md` |
