import assert from "node:assert/strict";
import test from "node:test";
import { exportedProfile, withPolicyBlock } from "../src/export.ts";
import {
  CLAUDE_CODE_PROFILE,
  SECOND_OPINIONS,
  TESTING_GUIDELINES,
} from "../src/index.ts";

const open = "<!-- fleet-config-sync:engineering-rules rev=abc123 -->";
const close = "<!-- /fleet-config-sync:engineering-rules -->";

test("replaces only the managed block and keeps its marker lines", () => {
  const file = `${open}\n## Old\n\n- old\n${close}\n\n# Mine\n\nKeep this.\n`;
  assert.equal(
    withPolicyBlock(file, "## New"),
    `${open}\n## New\n${close}\n\n# Mine\n\nKeep this.\n`,
  );
});

test("appends a block to a file without one", () => {
  assert.equal(
    withPolicyBlock("# Mine\n", "## New"),
    `# Mine\n\n<!-- fleet-config-sync:engineering-rules -->\n## New\n${close}\n`,
  );
  assert.equal(
    withPolicyBlock("", "## New"),
    `<!-- fleet-config-sync:engineering-rules -->\n## New\n${close}\n`,
  );
});

test("an unclosed block is an error, not a rewrite", () => {
  assert.throws(() => withPolicyBlock(`${open}\n## Old\n`, "## New"));
});

test("without overrides the export is the default profile", () => {
  assert.equal(exportedProfile("claude-code"), CLAUDE_CODE_PROFILE);
});

test("host overrides turn sections on and off in canonical order", () => {
  const profile = exportedProfile("claude-code", {
    "claude-code": { "second-opinions": true, testing: false },
  });
  assert.ok(profile.indexOf(SECOND_OPINIONS) > 0);
  assert.ok(!profile.includes(TESTING_GUIDELINES));
  assert.ok(profile.startsWith("## Delegation"));
});

test("overrides for other agents do not leak", () => {
  assert.equal(
    exportedProfile("codex", { "claude-code": { "second-opinions": true } }),
    exportedProfile("codex"),
  );
});

test("unknown agents, sections, and values are rejected", () => {
  assert.throws(() => exportedProfile("codex", { pi: {} }), /unknown agent/);
  assert.throws(
    () => exportedProfile("codex", { codex: { "second-opinion": true } }),
    /unknown section/,
  );
  assert.throws(
    () => exportedProfile("codex", { codex: { testing: "yes" } }),
    /true or false/,
  );
});
