# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-12-18

### Changed

- **BREAKING**: Complete rewrite of middleware functionality
- Now makes regular JavaScript object getters (defined with `get propertyName()`) reactive
- Getters automatically trigger React updates when accessed
- Removed options API (getters, include, exclude) - now detects JavaScript getters automatically
- Simplified API - just wrap your state creator with `getters()`

### Added

- Automatic wrapping of JavaScript object getters for reactivity
- Recursive support for nested objects
- Performance optimization - only getters are wrapped, plain values remain fast
- New example application demonstrating reactive getters
- Updated comprehensive documentation

## [1.0.0] - 2025-12-18

### Added

- Initial release
- Automatic getter generation for state properties
- Custom getter support
- Include/exclude options for controlling getter generation
- Full TypeScript support
- Example React application
- Comprehensive documentation
