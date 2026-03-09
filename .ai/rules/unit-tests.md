---
scope: project
alwaysApply: true
description: rules for when to add tests automatically
---

# Unit Tests

- Use TypeScript strict mode
- Write vitest unit tests for utility functions
- In a react component, when a reasonable utility function is found that can be broken out, do it and write the test for it
- React utility functions that are unit testable without react test library should be in either a utils file or a nearby utils file