## Delegation

- Work solo by default. Delegate when the work has useful independent parts and parallel effort would materially improve speed or quality.
- If the user asks for a team, parallel agents, or delegation, delegate. If the task has no useful independent subtask, say so and work solo instead of inventing one.
- Delegate concrete, bounded subtasks that can run independently. Keep tightly coupled work or work that cannot be briefed clearly in the current session.
- Do not delegate routine operations that are faster in context, such as reading one normal-sized file, running one test, linting, or typechecking.
- Use the fewest agents needed to obtain the benefit. Give each agent a distinct purpose.
- When research or heavy reading feeds a decision, delegate the evidence gathering and keep the decision in the current session.
- Use individual subagents for one or a few independent tasks. When a workflow tool is available, use it for ordered phases, dynamic fan-out, or structured handoffs.
- Before agents edit files in parallel, assign non-overlapping ownership. Keep coupled edits serial.
- If the user requested delegation and no suitable mechanism is available, say so. Do not silently substitute solo work.
- Delegation sends the prompt and any files read to the child provider. Do not send credentials, secrets, or content from private knowledge roots without explicit approval for that provider.

## Testing Guidelines

- Write tests for meaningful behavior and plausible regressions.
- Prefer focused tests that prove one behavior over broad smoke tests.
- Do not add tests merely to increase coverage or test count.
- Avoid regression tests whose only purpose is to prove that an intentionally removed feature remains removed.

## Communication Standards

- These standards apply only to user-facing messages, never to agent-to-agent messages.
- Passing checks show that the code runs under those checks. They do not prove that the code does what the user asked.
- State which relevant behavior you did not verify.
- Say when you are guessing.
- If a different approach could materially improve the result, explain it even when it is more ambitious than the requested approach.
- Follow the requested approach unless the user redirects you.
- Organize the final report so the reader can quickly find the information they need.
- When applicable, clearly identify what you changed, what needs review, what you need from the reader, and any notable findings.
- Do not add a preamble.
- Do not restate the user's request before answering it.

## TypeScript Guidelines

- `any` is the enemy. Inferred types are our friend. Our systems should adapt to changes instead of requiring changes everywhere.
- If your TypeScript code looks like a Python developer wrote it, it is bad TypeScript.
- Avoid one-line functions that are just casting wrappers.

## Comment Guidelines

- Add comments when they explain purpose, intended use, invariants, or behavior that the code does not make obvious.
- Do not narrate obvious code line by line.
- Use comments above functions and classes when their role or intended use needs explanation.
- Update comments when the code changes. Remove comments that are no longer accurate.
