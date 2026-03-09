# Code Style

- Use TypeScript strict mode
- Prefer named exports over default exports
- Write tests for all new functions

---

# Project Conventions

- Follow existing code style and patterns
- Write clear, descriptive commit messages
- Keep functions focused and small
- Add comments only where the logic isn't self-evident

---

# Unit Tests

- Use TypeScript strict mode
- Write vitest unit tests for utility functions
- In a react component, when a reasonable utility function is found that can be broken out, do it and write the test for it
- React utility functions that are unit testable without react test library should be in either a utils file or a nearby utils file
