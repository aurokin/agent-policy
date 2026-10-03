import {
  PROFILE_DEFAULTS,
  SECTIONS,
  sectionsFor,
  type SectionName,
} from "./profiles.ts";

/** Agents whose profile is exported into a global instructions file. */
export const EXPORT_TARGETS = {
  "claude-code": ".claude/CLAUDE.md",
  codex: ".codex/AGENTS.md",
  copilot: ".copilot/copilot-instructions.md",
} as const;

export type ExportAgent = keyof typeof EXPORT_TARGETS;

export function isExportAgent(value: string): value is ExportAgent {
  return Object.hasOwn(EXPORT_TARGETS, value);
}

function isSectionName(value: string): value is SectionName {
  return SECTIONS.some(([name]) => name === value);
}

/**
 * The agent's profile after applying host overrides from
 * `~/.config/agent-policy/config.json`, shaped like
 * `{ "claude-code": { "second-opinions": true } }`.
 */
export function exportedProfile(agent: ExportAgent, config: unknown = {}) {
  if (typeof config !== "object" || config === null || Array.isArray(config))
    throw new Error("config must be a JSON object");
  for (const key of Object.keys(config))
    if (!isExportAgent(key)) throw new Error(`unknown agent in config: ${key}`);

  const enabled = new Set<SectionName>(PROFILE_DEFAULTS[agent]);
  const overrides: unknown = new Map(Object.entries(config)).get(agent);
  if (overrides !== undefined) {
    if (
      typeof overrides !== "object" ||
      overrides === null ||
      Array.isArray(overrides)
    )
      throw new Error(`${agent} overrides must be an object`);
    for (const [name, on] of Object.entries(overrides)) {
      if (!isSectionName(name))
        throw new Error(`unknown section for ${agent}: ${name}`);
      if (typeof on !== "boolean")
        throw new Error(`${agent}.${name} must be true or false`);
      if (on) enabled.add(name);
      else enabled.delete(name);
    }
  }
  return sectionsFor([...enabled]).join("\n\n");
}

const OPEN_MARKER = /^<!-- fleet-config-sync:engineering-rules\b.*-->$/m;
const CLOSE_MARKER = "<!-- /fleet-config-sync:engineering-rules -->";

/**
 * Put the profile between the managed markers, keeping the marker lines and
 * everything outside them unchanged. Appends a block when none exists.
 */
export function withPolicyBlock(file: string, profile: string) {
  const open = OPEN_MARKER.exec(file);
  if (!open) {
    const separator = file === "" ? "" : file.endsWith("\n") ? "\n" : "\n\n";
    return `${file}${separator}<!-- fleet-config-sync:engineering-rules -->\n${profile}\n${CLOSE_MARKER}\n`;
  }
  const contentStart = open.index + open[0].length + 1;
  const close = file.indexOf(CLOSE_MARKER, contentStart);
  if (close === -1) throw new Error("managed block has no closing marker");
  return `${file.slice(0, contentStart)}${profile}\n${file.slice(close)}`;
}
