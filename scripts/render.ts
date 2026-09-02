import { mkdir, writeFile } from "node:fs/promises";
import { GLOBAL_INSTRUCTION_RULES } from "../src/policy.ts";
import { COPILOT_PROFILE } from "../src/profiles.ts";

await writeFile(
  new URL("../policy.md", import.meta.url),
  `${GLOBAL_INSTRUCTION_RULES}\n`,
);

const profilesDirectory = new URL("../profiles/", import.meta.url);
await mkdir(profilesDirectory, { recursive: true });
await writeFile(
  new URL("copilot.md", profilesDirectory),
  `${COPILOT_PROFILE}\n`,
);
