# Student reflection — English translation of statements supplied in chat

A green result only proves that the situations checked did not fail. It cannot prove that unchecked situations are correct. It is minimum necessary evidence, far from sufficient proof of correctness.

Hidden assertions reduce readability: another reader, including a future version of the author, cannot immediately see what is being checked or the expected value. Debugging needs an extra step because the failure points into the helper. Coverage review may mistake repeated helper calls for distinct checks. A later helper change can alter several tests at once. Assertions should therefore be visible in the individual cases.

Boundary values are easy places for defects to hide. An incorrect comparison around 120 minutes can leave ordinary examples green; a case exactly at the boundary exposes it. Tests should be chosen deliberately around limits rather than only convenient inputs.

Nineteen tests cannot cover every browser engine, version, resolution or malformed input. These combinations and input forms are too numerous to exhaust. Representative samples still leave untested situations that may fail.

Translation notes: the report clarifies that these unit tests run in Node, while the UI checks use a browser; AC2 rejects durations greater than 120, and rejecting equality is the planted defect. This English translation preserves the student's ideas with those technical corrections. Translation and organization were assisted by Codex.
