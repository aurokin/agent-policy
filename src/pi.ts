/**
 * Pi-specific scratch-file guidance.
 *
 * The root spells the fallback `$HOME`, not `~`. Shells do not expand a tilde
 * inside double quotes, so `${PI_CODING_AGENT_DIR:-~/...}` could create a
 * literal `~` directory in the working tree.
 */
export const PI_WORKSPACE_HEADER = "## Workspace";

export const PI_WORKSPACE_BULLETS = [
  "- Keep agent-created scratch files out of the working tree. This includes plans, notes, and intermediate reports.",
  "- Store scratch files under `${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}/artifacts/` in a folder for the current session.",
  "- When `$PI_SESSION_FILE` is set, mirror its location under `sessions/` into the `artifacts/` directory.",
  "- If you cannot write outside the working tree, use `.tmp/` as a fallback and add it to `.gitignore` if needed.",
  "- A file the user asked you to create is a deliverable, not scratch. Write it where the user requested.",
];

export const PI_WORKSPACE = [
  PI_WORKSPACE_HEADER,
  "",
  ...PI_WORKSPACE_BULLETS,
].join("\n");
