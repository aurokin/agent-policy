/**
 * Export an agent's profile into this host's global instructions file.
 *
 *   pnpm export <claude-code|codex|copilot>          show the diff
 *   pnpm export <claude-code|codex|copilot> --write  apply it
 */
import { spawnSync } from "node:child_process";
import {
  lstat,
  mkdtemp,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  EXPORT_TARGETS,
  exportedProfile,
  isExportAgent,
  withPolicyBlock,
} from "../src/export.ts";

const [agent, ...flags] = process.argv.slice(2);
if (!agent || !isExportAgent(agent) || flags.some((f) => f !== "--write")) {
  console.error(
    `usage: pnpm export <${Object.keys(EXPORT_TARGETS).join("|")}> [--write]`,
  );
  process.exit(2);
}
const write = flags.includes("--write");

const readOptional = (path: string) =>
  readFile(path, "utf8").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return undefined;
    throw error;
  });

const configPath = join(homedir(), ".config/agent-policy/config.json");
const configText = await readOptional(configPath);
const profile = exportedProfile(
  agent,
  configText === undefined ? {} : JSON.parse(configText),
);

const target = join(homedir(), EXPORT_TARGETS[agent]);
if (!(await stat(dirname(target)).catch(() => undefined))) {
  console.error(`${dirname(target)} does not exist; is ${agent} installed?`);
  process.exit(1);
}
if ((await lstat(target).catch(() => undefined))?.isSymbolicLink()) {
  console.error(`${target} is a symlink; skipping.`);
  process.exit(1);
}

const current = (await readOptional(target)) ?? "";
const next = withPolicyBlock(current, profile);
if (next === current) {
  console.log(`${target} is up to date.`);
  process.exit(0);
}

if (!write) {
  const scratch = await mkdtemp(join(tmpdir(), "agent-policy-"));
  const before = join(scratch, "before");
  const after = join(scratch, "after");
  await writeFile(before, current);
  await writeFile(after, next);
  spawnSync(
    "diff",
    ["-u", "--label", target, "--label", target, before, after],
    {
      stdio: "inherit",
    },
  );
  await rm(scratch, { recursive: true });
  console.log(`\nRun again with --write to apply.`);
  process.exit(0);
}

if (current !== "") {
  const stamp = new Date().toISOString().replace(/[-:]|\.\d+/g, "");
  await writeFile(`${target}.bak-${stamp}`, current);
}
const temporary = `${target}.agent-policy-tmp`;
await writeFile(temporary, next);
await rename(temporary, target);
console.log(`Updated ${target}.`);
