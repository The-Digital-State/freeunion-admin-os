# Admin Frontend

## Prerequisites

- Node 14
- NPM 6
- VS Code

## Setup Shared Repository

After pulling this repository in order to setup shared repository, please run next command
```bash
npm run init-shared
```

## Getting Started

In order to start working on a project you need to

1. Install all dependencies
   ```bash
   npm i
   ```
2. Run development version using
   ```bash
   npm run start
   ```

https://github.com/facebook/create-react-app

## Linting

In order to lint JavaScript code using [ESLint](https://eslint.org/) run:

```bash
npm run lint
```

If you want to autofix all possible lint issues run:

```bash
npm run lint:fix
```

## Code Formatting

We use [Prettier](https://prettier.io/) for code formatting.
If you want automatically format the code run:

```bash
npm run format
```

## Testing

We use [Jest](https://jestjs.io/) in order to test JavaScript.

If you need to run all tests with code coverage run:

```bash
npm run test
```

In case you practise TDD and test first approach you might want to run unit tests
in the watch mode:

```bash
npm run test:watch
```
