# TOR Node

[![CI — Lint & Test](https://github.com/Kushmanmb/TOR/actions/workflows/ci.yml/badge.svg)](https://github.com/Kushmanmb/TOR/actions/workflows/ci.yml)
[![Release](https://github.com/Kushmanmb/TOR/actions/workflows/release.yml/badge.svg)](https://github.com/Kushmanmb/TOR/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A lightweight TOR relay node with control-port API integration, managed via
self-hosted GitHub Actions runners.

---

## Table of Contents

- [Requirements](#requirements)
- [Setup](#setup)
- [Configuration](#configuration)
- [Running](#running)
- [Linting](#linting)
- [Workflows](#workflows)
- [Tagging a Release](#tagging-a-release)
- [Security](#security)

---

## Requirements

- **Node.js** ≥ 18
- **npm** ≥ 9
- A running [TOR](https://www.torproject.org/) daemon with the control port enabled

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/Kushmanmb/TOR.git
cd TOR

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and fill in TOR_API_KEY and other values
```

---

## Configuration

Copy `.env.example` to `.env` and set the following variables:

| Variable            | Default       | Description                              |
|---------------------|---------------|------------------------------------------|
| `TOR_API_KEY`       | *(required)*  | TOR control-port password / API key      |
| `TOR_CONTROL_HOST`  | `127.0.0.1`   | TOR control host                         |
| `TOR_CONTROL_PORT`  | `9051`        | TOR control port                         |
| `TOR_SOCKS_PORT`    | `9050`        | TOR SOCKS proxy port                     |
| `NODE_ENV`          | `development` | Runtime environment                      |

> **⚠ Never commit `.env` or any file containing your TOR API key.**
> The `.gitignore` in this repo excludes `.env`, private keys, and TOR
> hidden-service key files automatically.

In GitHub Actions the key is stored as a
[repository secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
named `TOR_API_KEY` (**Settings → Secrets and variables → Actions**).

---

## Running

```bash
npm start
```

---

## Linting

This project uses [ESLint v9](https://eslint.org/) with a flat config.

```bash
# Check for lint errors
npm run lint

# Auto-fix fixable issues
npm run lint:fix
```

Security-sensitive rules that are enforced:

- `no-eval` / `no-implied-eval` — prevent code injection
- `eqeqeq` — enforce strict equality checks
- `no-proto` — disallow prototype pollution vectors
- `prefer-const` — encourage immutability

---

## Workflows

All workflows run on **self-hosted runners** (`[self-hosted, linux, x64]`)
and are hardened with
[step-security/harden-runner](https://github.com/step-security/harden-runner).

| Workflow | Trigger | Description |
|----------|---------|-------------|
| `ci.yml` | push / PR to `main` | Lint and test on every change |
| `release.yml` | push of `v*.*.*` tag | Create a GitHub Release with auto-generated notes |
| `fetch-tor-api-key.yml` | manual / weekly schedule | Validate that `TOR_API_KEY` secret is configured correctly |

### Registering a Self-Hosted Runner

1. Go to **Settings → Actions → Runners → New self-hosted runner**
2. Follow the instructions for your OS
3. Assign the labels `self-hosted`, `linux`, `x64`

---

## Tagging a Release

```bash
# Bump version in package.json first, then:
git tag -s v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

Pushing a `v*.*.*` tag triggers the `release.yml` workflow which creates a
GitHub Release automatically.

---

## Security

- **Secrets** — `TOR_API_KEY` and all credentials are stored exclusively in
  GitHub Secrets; they are never hard-coded or logged.
- **`.gitignore`** — Private keys, `.env` files, TOR hidden-service key
  material, and other sensitive files are excluded from version control.
- **Runner hardening** — The `step-security/harden-runner` action is applied
  to every job to restrict egress and detect supply-chain attacks.
- **Dependabot** — Dependency updates are automated; see
  `.github/dependabot.yml`.

---

## License

[MIT](LICENSE) © Kushmanmb
