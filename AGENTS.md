# 🤖 AI Agent Instructions for ESCEMI Organization

This document provides global instructions and guidelines for AI agents working on projects within the ESCEMI organization. All agents should follow these principles to ensure consistency, quality, and alignment with our organizational values.

---

## 🎯 Core Principles

### 1. **SOLID Principles**

Apply SOLID principles consistently across all code:

- **S**ingle Responsibility Principle: Each class/module should have one reason to change
- **O**pen/Closed Principle: Open for extension, closed for modification
- **L**iskov Substitution Principle: Subtypes must be substitutable for their base types
- **I**nterface Segregation Principle: Many specific interfaces are better than one general-purpose interface
- **D**ependency Inversion Principle: Depend on abstractions, not concretions

### 2. **Clean Code Practices**

- Write self-documenting code with meaningful names
- Keep functions small and focused (ideally < 20 lines)
- Use consistent naming conventions appropriate to the language
- Avoid deep nesting (max 3 levels)
- Remove dead code and commented-out code
- Prefer composition over inheritance
- Use early returns to reduce complexity

### 3. **DRY (Don't Repeat Yourself)**

- Extract common logic into reusable functions/modules
- Create shared utilities for repeated patterns
- Use configuration over duplication
- Leverage existing libraries instead of reimplementing functionality

### 4. **YAGNI (You Aren't Gonna Need It)**

- Build only what is required now
- Avoid speculative generality
- Don't add functionality for potential future needs
- Keep solutions simple and focused

### 5. **KISS (Keep It Simple, Stupid)**

- Prefer simple, straightforward solutions
- Avoid overengineering
- Choose clarity over cleverness
- Minimize cognitive load for future developers

---

## 📚 Documentation Standards

### Documentation as a First-Class Citizen

Documentation is critical for developer experience and should be treated with the same importance as code.

#### Documentation Priorities

1. **User-facing documentation** (readme, API docs, guides)
2. **Code comments** (only when necessary to explain "why", not "what")
3. **Architecture decision records** (ADRs) for significant decisions
4. **Inline documentation** for complex algorithms or business logic

#### Documentation Best Practices

- **Avoid Duplication**: Single source of truth for each piece of information
- **Keep It Updated**: Update docs in the same PR as code changes
- **Be Concise**: Write clearly and avoid unnecessary verbosity
- **Include Examples**: Provide practical, working examples
- **Target the Audience**: Write for developers who will use or maintain the code

#### Readme Requirements

Every project must have a comprehensive README.md with:

- Clear project description
- Prerequisites and dependencies
- Installation instructions
- Usage examples
- Configuration options
- Contributing guidelines
- License information

#### Code Documentation

- Document public APIs thoroughly
- Explain complex business logic
- Document non-obvious design decisions
- Include examples for non-trivial usage
- Avoid stating the obvious (e.g., `// increment i` is noise)

---

## 🛠️ Technology Selection Guidelines

### Evaluation Criteria

When selecting dependencies, tools, or technologies, prioritize:

1. **Up-to-Date**: Actively maintained with recent updates
2. **Widely Used**: Strong community adoption and support
3. **Well Maintained**: Regular releases, responsive maintainers, good issue management
4. **Performant**: Proven performance characteristics
5. **Secure**: Good security track record, timely security updates
6. **Compatible**: Works well with our existing stack
7. **Documented**: Quality documentation and examples

### Technology Stack Alignment

Prefer technologies that align with our core stack:

- **Languages**: TypeScript, Go, Python
- **Infrastructure**: Docker, Kubernetes, Terraform
- **CI/CD**: GitHub Actions, ArgoCD
- **Monitoring**: Prometheus, Grafana

### Dependency Management

- Keep dependencies up-to-date with automated tools (Dependabot, Renovate)
- Regularly audit for security vulnerabilities
- Minimize dependency count (fewer dependencies = less maintenance)
- Avoid dependencies with heavy transitive dependency trees
- Prefer stable, mature libraries over bleeding-edge alternatives
- Document why each major dependency was chosen

---

## 💻 Development Best Practices

### Code Quality

- **Type Safety**: Use strong typing (TypeScript over JavaScript, typed Python)
- **Error Handling**: Handle errors explicitly, don't silently fail
- **Logging**: Use structured logging with appropriate levels
- **Testing**: Write tests before or alongside code (TDD/BDD)
- **Code Review**: All code must be reviewed before merging
- **Linting**: Use and enforce linters/formatters (ESLint, Prettier, Black, golangci-lint)

### Testing Strategy

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **End-to-end Tests**: Test critical user flows (where applicable)
- **Test Coverage**: Aim for >80% coverage, but prioritize meaningful tests
- **Test Quality**: Tests should be readable, maintainable, and fast
- **Mock External Dependencies**: Isolate tests from external services

### Version Control

- **Conventional Commits**: **MUST** follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification
  - **Commit Messages**: Use structured format: `<type>[optional scope]: <description>`
  - **Issue Titles**: Use structured format: `<type>[optional scope]: <description>`
  - **Pull Request Titles**: Use structured format: `<type>[optional scope]: <description>`
  - Common types: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
  - Examples:
    - `feat(auth): add OAuth2 login support`
    - `fix: resolve memory leak in cache handler`
    - `docs: update API documentation for v2 endpoints`
  - Breaking changes: Use `BREAKING CHANGE:` in footer or `!` after type/scope
  - **This is mandatory for all commits, issue titles, and PR titles**
- **Semantic Versioning**: Follow [Semantic Versioning 2.0.0](https://semver.org/) (SemVer)
  - Version format: `MAJOR.MINOR.PATCH` (e.g., `1.4.2`)
  - **MAJOR**: Increment for incompatible API changes (breaking changes)
  - **MINOR**: Increment for backwards-compatible new features
  - **PATCH**: Increment for backwards-compatible bugfixes
  - Prerelease versions: Use `-` suffix (e.g., `1.0.0-alpha.1`, `2.0.0-rc.1`)
  - Build metadata: Use `+` suffix (e.g., `1.0.0+20230615`)
- **Branch Strategy**: Feature branches from main, short-lived branches
- **Pull Requests**: Clear description, link to issues, include testing evidence
- **Small Changes**: Keep PRs focused and reviewable (< 400 lines ideal)

### Security

- **Never commit secrets**: Use environment variables or secret management
- **Input Validation**: Validate and sanitize all user inputs
- **Least Privilege**: Apply minimum necessary permissions
- **Dependency Scanning**: Regular security audits of dependencies
- **HTTPS/TLS**: Always use encrypted connections
- **Security Headers**: Implement appropriate security headers for web applications

### Performance

- **Optimize for Common Cases**: Focus on hot paths
- **Measure Before Optimizing**: Use profiling tools
- **Caching**: Implement caching strategically
- **Async Operations**: Use asynchronous patterns for I/O operations
- **Resource Management**: Clean up resources properly (connections, files, etc.)

---

## 🏗️ Architecture Guidelines

### Clean Architecture

- Separate concerns into layers (presentation, business logic, data)
- Dependencies point inward (business logic doesn't depend on frameworks)
- Use dependency injection for flexibility and testability
- Define clear boundaries between modules/packages

### Cloud-Native Design

- **12-Factor App**: Follow 12-factor app methodology
- **Stateless Services**: Design stateless, horizontally scalable services
- **Configuration**: Externalize configuration
- **Health Checks**: Implement liveness and readiness probes
- **Graceful Shutdown**: Handle termination signals properly
- **Observability**: Expose metrics, logs, and traces

### API Design

- **RESTful Principles**: Follow REST conventions for HTTP APIs
- **Versioning**: Version APIs from the start (v1, v2)
- **Consistency**: Maintain consistent naming and patterns
- **Error Responses**: Return meaningful, structured error messages
- **Documentation**: Use OpenAPI/Swagger for API documentation
- **Rate Limiting**: Implement rate limiting for public APIs

---

## 🚀 CI/CD and DevOps

### Continuous Integration

- **Automated Testing**: Run all tests on every commit
- **Build Validation**: Ensure code compiles/builds successfully
- **Linting**: Enforce code style and quality checks
- **Security Scanning**: Scan for vulnerabilities automatically
- **Fast Feedback**: Keep CI pipelines fast (< 10 minutes ideal)

### Continuous Deployment

- **Automated Deployments**: Deploy automatically after successful builds
- **Environment Parity**: Keep dev, staging, and prod as similar as possible
- **Blue-Green/Canary**: Use safe deployment strategies
- **Rollback Plan**: Always have a rollback strategy
- **Infrastructure as Code**: Manage infrastructure with Terraform

### Monitoring and Observability

- **Metrics**: Expose application and business metrics
- **Logging**: Implement structured, searchable logging
- **Tracing**: Use distributed tracing for complex systems
- **Alerts**: Set up meaningful alerts for critical issues
- **Dashboards**: Create dashboards for system health visibility

---

## 📋 Agent-Specific Instructions

### When Making Code Changes

1. **Understand Before Changing**: Read and understand existing code first
2. **Minimal Changes**: Make the smallest possible changes to achieve the goal
3. **Test Thoroughly**: Ensure changes work and don't break existing functionality
4. **Follow Patterns**: Match existing code style and patterns
5. **Update Documentation**: Update docs when changing behavior
6. **Security Review**: Check for security implications

### When Creating New Features

1. **Check Existing Solutions**: Look for existing functionality before creating new
2. **Design First**: Think through the design before coding
3. **Start Small**: Build incrementally with frequent testing
4. **Consider Edge Cases**: Handle error conditions and edge cases
5. **Performance**: Consider performance implications from the start
6. **Backward Compatibility**: Maintain compatibility unless explicitly breaking

### When Fixing Bugs

1. **Reproduce First**: Understand and reproduce the bug
2. **Root Cause Analysis**: Find the underlying cause, not just symptoms
3. **Add Tests**: Add tests that would have caught the bug
4. **Fix Completely**: Ensure the fix addresses all related issues
5. **Verify**: Test the fix thoroughly in different scenarios

### When Reviewing Code

1. **Be Constructive**: Provide helpful, specific feedback
2. **Check Against Standards**: Verify adherence to these guidelines
3. **Test Coverage**: Ensure adequate test coverage
4. **Security**: Look for security vulnerabilities
5. **Performance**: Consider performance implications
6. **Documentation**: Verify documentation is updated

### When Creating Issues or Pull Requests

1. **Conventional Commits Format**: **ALWAYS** use Conventional Commits format for titles
   - Format: `<type>[optional scope]: <description>`
   - Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`
   - Example: `feat(api): add user profile endpoint` or `fix: resolve memory leak in worker`
2. **Clear Description**: Provide comprehensive context, motivation, and implementation details
3. **Link Related Items**: Reference related issues, PRs, or documentation
4. **Include Testing Evidence**: Show that changes have been tested appropriately
5. **Keep Scope Focused**: One issue or PR should address one logical change

---

## 🌟 Language-Specific Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new projects
- Enable strict mode (`"strict": true`)
- Prefer functional patterns (immutability, pure functions)
- Use async/await over callbacks
- Use modern ES6+ features
- Format with Prettier, lint with ESLint

### Go

- Follow official Go style guide and `gofmt`
- Use `golangci-lint` for comprehensive linting
- Handle errors explicitly (never ignore errors)
- Use context for cancellation and timeouts
- Keep interfaces small and focused
- Write table-driven tests

### Python

- Use Python 3.10+ for new projects
- Follow PEP 8 style guide
- Use type hints (PEP 484)
- Format with Black, lint with Ruff or Pylint
- Use virtual environments
- Prefer `pathlib` over `os.path`
- Use dataclasses or Pydantic for data structures

### Infrastructure as Code (Terraform)

- Use modules for reusability
- Keep state in remote backend
- Use workspaces for environments
- Pin provider versions
- Use variables and outputs appropriately
- Document modules thoroughly

---

## 🤝 Collaboration and Communication

### Open Source Philosophy

- **Transparency**: Work in the open, communicate decisions
- **Community First**: Consider community feedback and contributions
- **Attribution**: Give credit where due
- **Licensing**: Respect licenses, use MIT for our projects

### Issue and PR Management

- **Conventional Commits Format**: **MUST** use Conventional Commits format for issue and PR titles
  - Format: `<type>[optional scope]: <description>`
  - Example issue titles: `feat: add user authentication`, `fix(api): resolve timeout issue`
  - Example PR titles: `docs: update installation guide`, `refactor(core): simplify error handling`
- **Clear Descriptions**: Write clear, detailed issue and PR descriptions
- **Link Related Items**: Reference related issues and PRs
- **Timely Responses**: Respond to feedback promptly
- **Close Stale Items**: Keep issue tracker clean and actionable

---

## 📖 Resources and References

### Recommended Reading

- Clean Code by Robert C. Martin
- The Pragmatic Programmer by Hunt and Thomas
- Designing Data-Intensive Applications by Martin Kleppmann
- Site Reliability Engineering (Google)

### Useful Tools

- **Code Quality**: SonarQube, CodeClimate
- **Security**: Snyk, Trivy, OWASP ZAP
- **Performance**: Lighthouse, k6, Apache Bench
- **Documentation**: Docusaurus, MkDocs

---

## ✅ Checklist for AI Agents

Before completing any task, verify:

- [ ] Code follows SOLID, Clean Code, DRY, YAGNI, and KISS principles
- [ ] Documentation is updated and comprehensive
- [ ] Tests are written and passing
- [ ] Security best practices are followed
- [ ] Dependencies are appropriate and up-to-date
- [ ] Code is linted and formatted
- [ ] Performance implications are considered
- [ ] Changes are minimal and focused
- [ ] **Commit messages follow Conventional Commits format**
- [ ] **Issue titles follow Conventional Commits format** (when creating/updating issues)
- [ ] **Pull request titles follow Conventional Commits format** (when creating/updating PRs)
- [ ] Version changes follow Semantic Versioning (when applicable)
- [ ] No secrets or sensitive data are committed

---

_These guidelines ensure consistency and quality across all escemi-tech projects. When in doubt, ask for clarification or refer to existing project examples._

**Version**: 1.0.0  
**Last Updated**: 2025  
**Maintainer**: ESCEMI Organization
