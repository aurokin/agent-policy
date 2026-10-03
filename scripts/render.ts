import { mkdir, writeFile } from "node:fs/promises";
import { RENDERED_PROFILES } from "../src/profiles.ts";

const profilesDirectory = new URL("../profiles/", import.meta.url);
await mkdir(profilesDirectory, { recursive: true });
for (const [fileName, profile] of Object.entries(RENDERED_PROFILES)) {
  await writeFile(new URL(fileName, profilesDirectory), `${profile}\n`);
}
