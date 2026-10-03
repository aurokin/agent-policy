export const COPILOT_RULES_HEADER = "## Copilot rules";

export const COPILOT_RULES_BULLETS = [
  "- Do not use computer-use tools unless the user explicitly asks you to interact with an application through its UI.",
];

export const COPILOT_RULES = [
  COPILOT_RULES_HEADER,
  "",
  ...COPILOT_RULES_BULLETS,
].join("\n");

export const COPILOT_INSTRUCTION_SECTIONS = [COPILOT_RULES] as const;

export const COPILOT_INSTRUCTION_RULES =
  COPILOT_INSTRUCTION_SECTIONS.join("\n\n");
