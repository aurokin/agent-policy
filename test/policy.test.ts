import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  COMMUNICATION_STANDARDS,
  DELEGATION,
  DELEGATION_BULLETS,
  DELEGATION_HEADER,
  GLOBAL_INSTRUCTION_RULES,
  GLOBAL_INSTRUCTION_SECTIONS,
  ORCHESTRATION,
  ORCHESTRATION_BULLETS,
  ORCHESTRATION_HEADER,
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
  assert.match(SECOND_OPINIONS, /second-opinion mechanism/);
  assert.doesNotMatch(SECOND_OPINIONS, /pi-setup|before_agent_start/);
});

test("communication standards apply only to user-facing messages", () => {
  assert.match(COMMUNICATION_STANDARDS, /only to user-facing messages/);
  assert.match(COMMUNICATION_STANDARDS, /invoke and apply the `unslop` skill/);
  assert.match(COMMUNICATION_STANDARDS, /every remaining standard/);
  assert.match(COMMUNICATION_STANDARDS, /never to agent-to-agent messages/);
});

test("delegation section uses delegation terminology", () => {
  assert.match(DELEGATION, /^## Delegation$/m);
  assert.doesNotMatch(DELEGATION, /orchestrat/i);
});

test("orchestration exports remain as compatibility aliases", () => {
  assert.equal(ORCHESTRATION_HEADER, DELEGATION_HEADER);
  assert.equal(ORCHESTRATION_BULLETS, DELEGATION_BULLETS);
  assert.equal(ORCHESTRATION, DELEGATION);
});
