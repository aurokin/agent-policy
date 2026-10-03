import { mkdir, writeFile } from "node:fs/promises";
import { GLOBAL_INSTRUCTION_RULES } from "../src/policy.ts";
import { RENDERED_PROFILES } from "../src/profiles.ts";

await writeFile(
  new URL("../policy.md", import.meta.url),
  `${GLOBAL_INSTRUCTION_RULES}\n`,
);

const profilesDirectory = new URL("../profiles/", import.meta.url);
await mkdir(profilesDirectory, { recursive: true });
for (const [fileName, profile] of Object.entries(RENDERED_PROFILES)) {
  await writeFile(new URL(fileName, profilesDirectory), `${profile}\n`);
}
