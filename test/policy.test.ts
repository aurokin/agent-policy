import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  COMMUNICATION_STANDARDS,
  COPILOT_INSTRUCTION_RULES,
  COPILOT_PROFILE,
  COPILOT_PROFILE_SECTIONS,
  COPILOT_RULES,
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

test("the rendered Copilot profile matches the package source byte for byte", async () => {
  const rendered = await readFile(
    new URL("../profiles/copilot.md", import.meta.url),
    "utf8",
  );
  assert.equal(rendered, `${COPILOT_PROFILE}\n`);
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

test("the Copilot profile composes shared policy with its isolated overlay", () => {
  assert.equal(COPILOT_PROFILE, COPILOT_PROFILE_SECTIONS.join("\n\n"));
  assert.equal(
    COPILOT_PROFILE,
    `${GLOBAL_INSTRUCTION_RULES}\n\n${COPILOT_INSTRUCTION_RULES}`,
  );
  assert.match(COPILOT_RULES, /harness defaults for subagents/);
  assert.match(COPILOT_RULES, /current request explicitly specifies/);
  assert.match(COPILOT_RULES, /Do not use computer-use tools/);
  assert.match(COPILOT_RULES, /Do not create a pull request/);
  assert.doesNotMatch(
    GLOBAL_INSTRUCTION_RULES,
    /computer-use|harness defaults for subagents/,
  );
});

test("second-opinion policy remains harness-neutral", () => {
  assert.match(SECOND_OPINIONS, /second-opinion mechanism/);
  assert.doesNotMatch(SECOND_OPINIONS, /pi-setup|before_agent_start/);
});

test("communication standards apply only to user-facing messages", () => {
  assert.match(COMMUNICATION_STANDARDS, /only to user-facing messages/);
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
