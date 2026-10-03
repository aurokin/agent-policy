import { COPILOT_RULES } from "./copilot.ts";
import { PI_WORKSPACE } from "./pi.ts";
import {
  COMMENT_GUIDELINES,
  COMMUNICATION_STANDARDS,
  DELEGATION,
  ENGINEERING_POLICY,
  KNOWN_PERFORMANCE_PITFALLS,
  SAFETY_RULES,
  SECOND_OPINIONS,
  TESTING_GUIDELINES,
  TYPESCRIPT_GUIDELINES,
} from "./policy.ts";

/** Every section by name, in the order profiles render them. */
export const SECTIONS = [
  ["engineering-rules", ENGINEERING_POLICY],
  ["delegation", DELEGATION],
  ["second-opinions", SECOND_OPINIONS],
  ["safety-rules", SAFETY_RULES],
  ["testing", TESTING_GUIDELINES],
  ["communication", COMMUNICATION_STANDARDS],
  ["typescript", TYPESCRIPT_GUIDELINES],
  ["comments", COMMENT_GUIDELINES],
  ["performance-pitfalls", KNOWN_PERFORMANCE_PITFALLS],
  ["copilot-rules", COPILOT_RULES],
  ["workspace", PI_WORKSPACE],
] as const;

export type SectionName = (typeof SECTIONS)[number][0];

/**
 * Sections each agent gets by default. Pi's profile belongs to pi-setup and
 * takes no overrides; the other agents can be tuned per host at export.
 */
export const PROFILE_DEFAULTS = {
  pi: [
    "engineering-rules",
    "delegation",
    "safety-rules",
    "testing",
    "communication",
    "typescript",
    "comments",
    "workspace",
  ],
  codex: ["delegation", "testing", "communication", "typescript", "comments"],
  "claude-code": [
    "delegation",
    "testing",
    "communication",
    "typescript",
    "comments",
  ],
  copilot: ["testing", "typescript", "comments", "copilot-rules"],
} as const satisfies Record<string, readonly SectionName[]>;

export type Agent = keyof typeof PROFILE_DEFAULTS;

/** Section text for the enabled names, in canonical order. */
export function sectionsFor(enabled: readonly SectionName[]) {
  return SECTIONS.filter(([name]) => enabled.includes(name)).map(
    ([, text]) => text,
  );
}

export const PI_PROFILE_SECTIONS = sectionsFor(PROFILE_DEFAULTS.pi);
export const PI_PROFILE = PI_PROFILE_SECTIONS.join("\n\n");

export const CODEX_PROFILE_SECTIONS = sectionsFor(PROFILE_DEFAULTS.codex);
export const CODEX_PROFILE = CODEX_PROFILE_SECTIONS.join("\n\n");

export const CLAUDE_CODE_PROFILE_SECTIONS = sectionsFor(
  PROFILE_DEFAULTS["claude-code"],
);
export const CLAUDE_CODE_PROFILE = CLAUDE_CODE_PROFILE_SECTIONS.join("\n\n");

export const COPILOT_PROFILE_SECTIONS = sectionsFor(PROFILE_DEFAULTS.copilot);
export const COPILOT_PROFILE = COPILOT_PROFILE_SECTIONS.join("\n\n");

/** Sections no agent gets by default; kept for occasional manual use. */
export const OPT_IN_SECTIONS = sectionsFor(
  SECTIONS.map(([name]) => name).filter(
    (name) =>
      !Object.values(PROFILE_DEFAULTS).some((defaults) =>
        defaults.some((enabled) => enabled === name),
      ),
  ),
);

export const OPT_IN = OPT_IN_SECTIONS.join("\n\n");

/** Rendered file name under `profiles/` for each composition. */
export const RENDERED_PROFILES = {
  "pi.md": PI_PROFILE,
  "codex.md": CODEX_PROFILE,
  "claude-code.md": CLAUDE_CODE_PROFILE,
  "copilot.md": COPILOT_PROFILE,
  "opt-in.md": OPT_IN,
} as const;
