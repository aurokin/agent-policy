import { writeFile } from "node:fs/promises";
import { GLOBAL_INSTRUCTION_RULES } from "../src/policy.ts";

await writeFile(
  new URL("../policy.md", import.meta.url),
  `${GLOBAL_INSTRUCTION_RULES}\n`,
);
