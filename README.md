# StudyForge Precision Edition

A premium client-side study toolkit with a precision-first architecture.

## What was improved
- BigInt-backed exact factorial / permutation / combination calculations.
- Exact reduced fractions for matrix calculations.
- A strict scientific-expression parser rather than unrestricted expression execution.
- Input/domain validation.
- Independent verification for selected unit, compound-interest and loan calculations.
- Explicit formulas and step-by-step output for supported word-problem families.
- Deterministic local calculations; no network is required for the math engine.

## Accuracy boundary
No software can honestly promise "100% accuracy for every possible mathematical problem." JavaScript's built-in floating-point type remains in use for transcendental functions (sin/cos/log), geometry constants such as π, and some real-valued finance/science calculations. Exact arithmetic is used where the inputs and operations permit it.

For the next production-grade level, use a server-side arbitrary-precision/symbolic mathematics engine (for example, a vetted CAS) and an automated reference test suite with thousands of cases. This static edition is intentionally dependency-free so it can be opened directly.
