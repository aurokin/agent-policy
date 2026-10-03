import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  CLAUDE_CODE_PROFILE_SECTIONS,
  CODEX_PROFILE_SECTIONS,
  COMMUNICATION_STANDARDS,
  COPILOT_INSTRUCTION_SECTIONS,
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
  OPT_IN_SECTIONS,
  PI_PROFILE_SECTIONS,
  PI_WORKSPACE,
  RENDERED_PROFILES,
  SECOND_OPINIONS,
} from "../src/index.ts";

test("the rendered policy matches the package source byte for byte", async () => {
  const rendered = await readFile(
    new URL("../policy.md", import.meta.url),
    "utf8",
  );
  assert.equal(rendered, `${GLOBAL_INSTRUCTION_RULES}\n`);
});

test("each rendered profile matches the package source byte for byte", async () => {
  for (const [fileName, profile] of Object.entries(RENDERED_PROFILES)) {
    const rendered = await readFile(
      new URL(`../profiles/${fileName}`, import.meta.url),
      "utf8",
    );
    assert.equal(rendered, `${profile}\n`, fileName);
  }
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

test("every section is either assigned to a profile or opt-in", () => {
  const assigned: readonly string[] = [
    ...PI_PROFILE_SECTIONS,
    ...CODEX_PROFILE_SECTIONS,
    ...CLAUDE_CODE_PROFILE_SECTIONS,
    ...COPILOT_PROFILE_SECTIONS,
  ];
  const optIn: readonly string[] = OPT_IN_SECTIONS;
  for (const section of [
    ...GLOBAL_INSTRUCTION_SECTIONS,
    ...COPILOT_INSTRUCTION_SECTIONS,
    PI_WORKSPACE,
  ]) {
    assert.notEqual(
      assigned.includes(section),
      optIn.includes(section),
      section.slice(0, section.indexOf("\n")),
    );
  }
});

test("agent-specific sections stay in their own profile", () => {
  const profilesContaining = (section: string) =>
    Object.entries(RENDERED_PROFILES)
      .filter(([, profile]) => profile.includes(section))
      .map(([fileName]) => fileName);
  assert.deepEqual(profilesContaining(COPILOT_RULES), ["copilot.md"]);
  assert.deepEqual(profilesContaining(PI_WORKSPACE), ["pi.md"]);
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
