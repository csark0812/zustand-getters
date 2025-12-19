# Contributing to zustand-getters

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/csark0812/zustand-getters.git
   cd zustand-getters
   ```

2. **Install dependencies:**

   ```bash
   bun install
   cd example && bun install
   ```

3. **Run the development build:**

   ```bash
   # In root directory
   bun run dev  # Watches and rebuilds on changes
   ```

4. **Run the example app:**
   ```bash
   # In example directory
   cd example
   bun run dev  # Starts on http://localhost:5173
   ```

## Project Structure

```
zustand-getters/
├── src/
│   └── index.ts           # Main middleware implementation
├── example/
│   └── src/               # Demo React application
├── test.ts                # Basic tests
└── dist/                  # Built package (generated)
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- **Code Style:** We use Prettier and ESLint
- **TypeScript:** All code must type-check
- **Testing:** Add tests for new features

### 3. Test Your Changes

```bash
# Type checking
bun run typecheck

# Linting
bun run lint

# Run tests
bun run test

# Build
bun run build

# Test in example app
cd example && bun run dev
```

### 4. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
git commit -m "feat: add memoization support for getters"

# Bug fixes
git commit -m "fix: resolve infinite loop in nested proxies"

# Documentation
git commit -m "docs: add troubleshooting guide"

# Refactoring
git commit -m "refactor: optimize proxy creation"

# Tests
git commit -m "test: add coverage for nested objects"
```

### 5. Submit a Pull Request

1. Push your branch to GitHub
2. Open a Pull Request against `main`
3. Fill out the PR template
4. Wait for review

## What to Contribute

### Good First Issues

- Add more examples to the example app
- Improve documentation
- Add tests
- Fix typos

### Feature Ideas

- Performance optimizations
- Better TypeScript types
- DevTools integration
- Memoization support

### Bug Reports

Found a bug? Please open an issue with:

- Clear description
- Minimal reproduction
- Expected vs actual behavior
- Environment details (Node/Bun version, OS)

## Code Style

- Use TypeScript for all code
- Format with Prettier (runs automatically)
- Follow existing patterns in the codebase
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Testing

Currently we have basic tests in `test.ts`. When adding features:

1. Add tests that verify the feature works
2. Add tests for edge cases
3. Ensure existing tests still pass

## Documentation

When adding features:

1. Update README.md if it changes the API
2. Add JSDoc comments to new exports
3. Add examples to the example app
4. Update IMPLEMENTATION.md if relevant

## Questions?

- Open a Discussion on GitHub
- Ask in your Pull Request
- Open an issue

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
