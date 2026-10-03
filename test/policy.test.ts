import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  COMMUNICATION_STANDARDS,
  COPILOT_RULES,
  DELEGATION,
  DELEGATION_BULLETS,
  DELEGATION_HEADER,
  ORCHESTRATION,
  ORCHESTRATION_BULLETS,
  ORCHESTRATION_HEADER,
  PI_WORKSPACE,
  RENDERED_PROFILES,
  SECOND_OPINIONS,
} from "../src/index.ts";
import * as policy from "../src/index.ts";

test("each rendered profile matches the package source byte for byte", async () => {
  for (const [fileName, profile] of Object.entries(RENDERED_PROFILES)) {
    const rendered = await readFile(
      new URL(`../profiles/${fileName}`, import.meta.url),
      "utf8",
    );
    assert.equal(rendered, `${profile}\n`, fileName);
  }
});

test("every section is rendered in a profile or the opt-in file", () => {
  const rendered = Object.values(RENDERED_PROFILES).join("\n\n");
  for (const [name, header] of Object.entries(policy)) {
    if (!name.endsWith("_HEADER") || typeof header !== "string") continue;
    assert.match(rendered, new RegExp(`^${header}$`, "m"), name);
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
