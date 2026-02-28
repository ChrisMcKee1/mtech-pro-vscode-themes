# Contributing to M Tech Themes

## Development Workflow
We use a strictly enforced theme pairing architecture and automated test suite.

### Running Tests
Any time you modify a theme, you must run the validation suite:
`ash
cd tests
.\run-tests.cmd --full
`

### Pull Requests
- All PRs must pass the --contrast checks.
- Keep PRs scoped to specific fixes or a single theme addition.
- Update CHANGELOG.md with your changes.