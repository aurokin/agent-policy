export const COPILOT_RULES_HEADER = "## Copilot rules";

export const COPILOT_RULES_BULLETS = [
  "- Trust the harness defaults for subagents. Do not specify a model, context tier, or reasoning effort unless the current request explicitly specifies those settings for the subagent.",
  "- Do not use computer-use tools unless the user explicitly asks you to interact with an application through its UI.",
  "- When asked to implement, complete and validate the changes so they are ready for review. Do not create a pull request unless the current request explicitly asks for one.",
];

export const COPILOT_RULES = [
  COPILOT_RULES_HEADER,
  "",
  ...COPILOT_RULES_BULLETS,
].join("\n");

export const COPILOT_INSTRUCTION_SECTIONS = [COPILOT_RULES] as const;

export const COPILOT_INSTRUCTION_RULES =
  COPILOT_INSTRUCTION_SECTIONS.join("\n\n");
