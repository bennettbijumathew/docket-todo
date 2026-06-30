# docket-todo

## 2.5.0

### Minor Changes

  - Added mass actions for the planner list
    - A Context Menu is added so that user can do these actions:
      - Delete
      - Toggle to Visible State
      - Toggle to Hidden State
    - On clicking `CTRL + 'CLICK`, a user can select multiple planners and run actions for the selected planners.

## 2.4.0

### Minor Changes

- Refactored the planner page to be similar to the task page.
- Added a search functionality for the /planner page.
  - On reaching the page, a user can search for specific planners.
- Added a grouping functionality for the /planner page
  - The user can now group tasks into categories such as:
    - Visible
    - All
    - Colour
  - Through the different groups, all tasks are placed under different headers.

## 2.3.0

### Minor Changes

- Refactored the task page to allow for new features.
- Migrated task page's scrolling to bits-ui's scroll area component
  - This allows consistent behavior across the website
  - Removes buggy behaviour as the tailwind-scrollbar package uses React. This led to dependency issues and missing features.
- Added a search functionality for the /task page
  - On reaching the page, a user can search for specific tasks that are visible.
- Added a grouping functionality for the /task page
  - The user can now group tasks into categories such as:
    - All
    - Completed
    - Due Date
  - Through the different groups, all tasks are placed under different headers.

## 2.2.0

### Minor Changes

- Redesigned the task item within the task list
  - Changed the task planner list to show 5 planner names with extra being shown on hover.
    - This allows planners to be more distinctive.
    - Able to distinguish planners that are concealed / displayed.

  - Added mass actions for the task list
    - A Context Menu is added so that user can do these actions:
      - Complete
      - Incomplete
      - Delete
    - On clicking `CTRL + 'CLICK`, a user can select multiple tasks and run actions for the selected tasks.

## 2.1.2

### Patch Changes

- Integrated new test suite into the build workflow

## 2.1.1

### Patch Changes

- Created a test suite to test the repository function

## 2.1.0

### Minor Changes

- Implemented a notifications scheduler for the android and windows applications
  - Notifications run based on the task's due date.
  - Windows Notification Scheduler runs while the app is open. This will be improved upon in future updates.
  - Android Notification Scheduler works even while the application is closed.

## 2.0.4

### Patch Changes

- Refactored the application and the planner to task controller to have similar design to other refactored components

## 2.0.3

This patch internally cleans up the authentication side of the code.

### Patch Changes

- Refactored the code of the auth repository to have clearer responsibilities.

## 2.0.2

This patch internally cleans up the task side of the code.

### Patch Changes

#### Updates

- Refactored the code of the task repository to have clearer responsibilities.

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
