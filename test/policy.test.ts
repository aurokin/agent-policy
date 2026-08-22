import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  GLOBAL_INSTRUCTION_RULES,
  GLOBAL_INSTRUCTION_SECTIONS,
  SECOND_OPINIONS,
} from "../src/index.ts";

test("the rendered policy matches the package source byte for byte", async () => {
  const rendered = await readFile(
    new URL("../policy.md", import.meta.url),
    "utf8",
  );
  assert.equal(rendered, `${GLOBAL_INSTRUCTION_RULES}\n`);
});

test("sections are separated and ordered once", () => {
  assert.equal(
    GLOBAL_INSTRUCTION_RULES,
    GLOBAL_INSTRUCTION_SECTIONS.join("\n\n"),
  );
  for (const section of GLOBAL_INSTRUCTION_SECTIONS) {
    assert.equal(GLOBAL_INSTRUCTION_RULES.split(section).length, 2);
  }
});

test("second-opinion policy remains harness-neutral", () => {
  assert.match(SECOND_OPINIONS, /rubber-duck, advisor, or consult/);
  assert.doesNotMatch(SECOND_OPINIONS, /pi-setup|before_agent_start/);
});
