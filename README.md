# ez-templates

<p align="left">
  <a href="https://www.npmjs.com/package/ez-templates">
    <img src="https://img.shields.io/npm/v/ez-templates.svg" alt="npm version" />
  </a>
  <a href="https://github.com/AndreaPallotta/EzWebTemplate/actions/workflows/publish.yml">
    <img src="https://github.com/AndreaPallotta/EzWebTemplate/actions/workflows/publish.yml/badge.svg" alt="Build Status" />
  </a>
  <a href="https://www.npmjs.com/package/ez-templates">
    <img src="https://img.shields.io/npm/dm/ez-templates.svg" alt="npm downloads" />
  </a>
  <a href="https://github.com/AndreaPallotta/EzWebTemplate/blob/master/LICENSE.md">
    <img src="https://img.shields.io/github/license/AndreaPallotta/ez-templates" alt="License: MIT" />
  </a>
  <a href="https://github.com/AndreaPallotta/EzWebTemplate/stargazers">
    <img src="https://img.shields.io/github/stars/AndreaPallotta/EzWebTemplate.svg" alt="GitHub Stars" />
  </a>
</p>

A simple, fast, and fully offline CLI tool to bootstrap pre-configured project templates.

---

## Preview

<p align="left">
  <img src="preview.png" alt="ez-templates CLI Preview" width="600" />
</p>

---

## Installation

Run directly without installing:
```sh
npx ez-templates
```

Or install globally:
```sh
npm install -g ez-templates
```

---

## Usage

### Interactive Mode
Run the command without options to start the interactive walkthrough:
```sh
ezp
```

### CLI Options (Non-Interactive Mode)
Configure template bootstrapping directly via command line flags:
```sh
ezp [options]
```

| Flag | Option | Description |
| --- | --- | --- |
| `-t` | `--template <name>` | Template(s) to clone (express, socketio, react, rust, elixir, go) |
| `-n` | `--name <name>` | Custom folder name for the cloned template |
| `-p` | `--path <path>` | Target parent directory path (default: current directory) |
| `-m` | `--manager <name>` | Package manager to run setup/dependencies install (npm, yarn, mix, cargo, go) |
| `-y` | `--yes` | Skip confirmation prompts and use defaults for missing options |
| `-h` | `--help` | Show usage and options information |
| `-v` | `--version` | Show current CLI version |

#### Examples
- Clone the Express TS template using defaults without prompts:
  ```sh
  ezp -t express -y
  ```
- Clone multiple templates (Express and React) to a custom path:
  ```sh
  ezp -t express -t react -p ./my-workspace
  ```

---

## Available Templates

All templates are packaged locally within the CLI and clone instantly offline:

- **Express TS** (`express`): Modern Express.js server written in TypeScript with native tests.
- **Socket.io TS** (`socketio`): WebSocket server template written in TypeScript.
- **ReactJS + MUI TS** (`react`): Vite, React, Material UI (MUI), and TypeScript boilerplate.
- **Rust + Axum** (`rust`): High-performance, secure REST API server written in Rust.
- **Elixir Server** (`elixir`): Backend server template in Elixir.
- **Go HTTP API** (`go`): Clean and modern REST API server using Go standard library (compatible with Go 1.22+).

---

## License

Copyright © 2022 [Andrea Pallotta](https://github.com/AndreaPallotta).  
Licensed under the [MIT License](file:///c:/Users/andre/OneDrive/Desktop/projects/ez-templates/LICENSE.md).
