## Testing Guidelines

- Write tests for meaningful behavior and plausible regressions.
- Prefer focused tests that prove one behavior over broad smoke tests.
- Do not add tests merely to increase coverage or test count.
- Avoid regression tests whose only purpose is to prove that an intentionally removed feature remains removed.

## TypeScript Guidelines

- `any` is the enemy. Inferred types are our friend. Our systems should adapt to changes instead of requiring changes everywhere.
- If your TypeScript code looks like a Python developer wrote it, it is bad TypeScript.
- Avoid one-line functions that are just casting wrappers.

## Comment Guidelines

- Add comments when they explain purpose, intended use, invariants, or behavior that the code does not make obvious.
- Do not narrate obvious code line by line.
- Use comments above functions and classes when their role or intended use needs explanation.
- Update comments when the code changes. Remove comments that are no longer accurate.

## Copilot rules

- Do not use computer-use tools unless the user explicitly asks you to interact with an application through its UI.
