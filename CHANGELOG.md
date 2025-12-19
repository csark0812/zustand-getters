# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-18

### Added

- Initial release
- Automatic wrapping of JavaScript object getters (defined with `get propertyName()`) for reactivity
- Getters automatically trigger React updates when accessed
- Recursive support for nested objects
- Performance optimization - only getters are wrapped, plain values remain fast
- Full TypeScript support
- Example React application demonstrating reactive getters
- Comprehensive documentation
