# Changelog

## [Unreleased]

### Added
- Comprehensive tests for BDDTestCaseCard component
- Comprehensive tests for StepByStepTestCaseCard component
- Test coverage for test-case-parser utility

### Fixed
- Fixed BDD test case content not updating when modified
- Fixed test steps appearing hardcoded by adding state synchronization
- Fixed test-case-parser test failures with improved title combination
- Fixed invalid JSON handling in test case parser
- Improved validation logic for graceful error handling

### Changed
- Added useEffect to sync editedFeature state when feature prop changes
- Added useEffect to sync editedTestCase state when testCase prop changes
- Updated BDD test case title combination to use consistent "Feature: Scenario" format
- Improved error handling for empty features and invalid JSON

## Previous Releases
- See git history for previous changes