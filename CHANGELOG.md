# docket-todo

## 2.0.2
This patch internally cleans up the task side of the code.

### Patch Changes

#### Updates
- Refactored the code of the task repository to have clearer responsiblitiies.

## 2.0.1

This patch internally cleans up the planner side of the code.

### Patch Changes

#### Updates

- Refactored the code of the planner repository to have clearer responsibilities.

## 2.0.0

This release introduces update infrastructure for Windows, enabling smoother future updates.

### Major Changes

#### Updates

- Implemented an application updater for the windows application.
- Created a settings page for the whole application.

#### Justification of Changes

- Ensures users stay on the latest version without compatibility issues
- Prepares the app for faster and more frequent future updates

#### Instructions to upgrade

1. Visit the [latest release](https://github.com/bennettbijumathew/docket-todo/releases/latest/).
2. Find your preferred installation method for windows and download the application installer.
3. Run the installer to update to the newest version

## 1.0.3

This patch fixes a few issues with the builds from the release workflow.

### Patch Changes

#### Updates

- Fixed an issue with the Release Workflow where files were not being built in the correct file format.

## 1.0.2

This patch creates a workflow that drafts windows and android applications.

### Patch Changes

#### Updates

- Created a release workflow that creates a draft release of the android and windows applications.

#### Justification of Changes

- Allows for faster and more frequent future updates

## 1.0.1

This patch adds a simple build workflow for easier development.

### Patch Changes

#### Updates

- Created a build workflow that runs on each push and pull request for all branches.

## 1.0.0

This is the first release of the application. It is the first fully working version of the application.

### Major Changes

#### Updates

- Implemented user authentication.
- Created a user interface for users to interact with tasks and planners.
- Added CRUD ability for tasks and planners data.
- Created a Windows and Android release.
- Implemented a README.md file for the project.
