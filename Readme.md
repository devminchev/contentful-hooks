# contentful-hooks

Automates the creation, updating, and deletion of Contentful webhooks that push iGaming lobby content into AWS OpenSearch clusters for dev, staging, and production environments.

## Overview

### Non-technical summary
This tool removes a large amount of manual work needed to keep Contentful and AWS OpenSearch in sync. Instead of clicking through the Contentful UI, engineers run a single CLI command to create, update, or delete the full set of lobby-related webhooks for a given environment.

### Technical summary
`contentful-hooks` is a Node.js CLI built with `commander` and `axios`. It reads environment-specific credentials, generates deterministic webhook payloads for multiple Contentful models, and calls the Contentful Management API to provision or manage webhook definitions. Each webhook includes custom headers (idempotency, ownership markers, and deployment metadata) so that reruns are safe and previously-created hooks can be filtered or updated programmatically.

### Tech stack
- **Runtime:** Node.js 18+
- **Package manager:** Yarn
- **CLI framework:** [commander](https://github.com/tj/commander.js)
- **HTTP client:** [axios](https://axios-http.com)
- **Target platform:** Contentful Management API → AWS API Gateway → AWS OpenSearch
- **Environment management:** `dotenv`

## How it works
1. `src/index.js` wires `commander` commands (`create`, `create-v3`, `update`, `update-v3`, `delete`) to an `init` routine.
2. `init` resolves the jurisdiction (`JURISDICTION`) and environment (`NODE_ENV`) specific configuration from `src/config.js`, validates it, and prepares the Contentful Management API client (`src/client.js`).
3. For create/update flows, the tool builds webhook payloads from the declarative builders in `src/hookPayloads`. Each payload encapsulates:
   - Webhook name suffixes, filters, and transformation body templates per model.
   - Target AWS API Gateway URLs per environment (`OS_HOST`).
   - Headers generated in `src/webhooksApi/webhookMethods.js`, including SHA-256 idempotency keys and ownership markers.
4. `src/webhooksApi/publishHooks.js` orchestrates the creation of every V2/V3 webhook (Ventures, Games, Sections, ML defaults, Themes, etc.). Delete workflows reuse the same builder with DELETE payloads.
5. Updating/deleting reuses ownership metadata (`X-unique-own-identifier`) to locate hooks (`src/webhooksApi/collectHooks.js`) and either:
   - Recreate the payload and send a `PUT` request with optimistic locking (`X-Contentful-Version`), or
   - Issue `DELETE` requests per hook ID or environment grouping.

## Project architecture
```
src/
├── client.js                 # Axios client factory for the Contentful Management API
├── config.js                 # Jurisdiction + environment specific credentials and hosts
├── constants/                # Naming helpers and webhook identification logic
├── hookPayloads/             # Declarative payload builders for each model (V2 & V3)
├── utils.js                  # Shared helpers (validation, topic selection, hashing, logging)
├── webhooksApi/
│   ├── webhookMethods.js     # hookBuilder + orchestrators for create/create-v3
│   ├── publishHooks.js       # Creates each webhook using payload builders
│   ├── deleteHooks.js        # Delete-specific hook builders (general, gameV2, archive)
│   ├── deleteingWebhooks.js  # Runtime delete command implementation (id/env/all)
│   ├── updateWebhooks.js     # Fetch/rebuild/update flows w/ ownership & suffix parsing
│   ├── collectHooks.js       # Helpers to list, filter, and group owned hooks
│   └── webhooksHttpReq.js    # Thin Contentful HTTP wrappers (create/update/delete)
└── index.js                  # CLI entrypoint (commander commands)
```
Supporting documentation lives in `docs/` and explains the detailed workflows behind create, update, and delete commands.

## Installation
```bash
# Clone the repo
git clone https://gitlab.ballys.tech/excite/native/tools/contentful-hooks.git
cd contentful-hooks

# Install dependencies
yarn install
```

## Configuration
Copy `env_example` to `.env` and populate every credential:

```bash
cp env_example .env
```

Key environment variables (per jurisdiction and environment):
- `DEV_OS_HOST`, `STG_OS_HOST`, `PROD_OS_HOST`
- `DEV_OS_USER`, `DEV_OS_PASS`, etc.
- `DEV_EU_CONTENTFUL_BEARER_TOKEN`, `DEV_EU_CONTENTFUL_SPACE`, etc.
- `NODE_ENV` (`dev`, `stg`, `prod`) and `JURISDICTION` (`eu`, `na`)

The CLI loads them via `dotenv` and `src/config.js`. Missing values cause a validation error before any HTTP calls are made.

## Usage
All commands can be run through Yarn scripts or by invoking `node src/index.js` directly.

```bash
contentful-hooks [command] [options]
```

### Create V2 webhooks
Provision the full iGaming lobby webhook suite for the selected jurisdiction/environment.
```bash
yarn hook:create
# or
yarn node src/index.js create
```

### Create V3 webhooks
Provision the V3 API-specific webhooks (navigation, views, ML sections, etc.).
```bash
yarn hook:create:v3
```

### Update V2 webhooks
Rebuild specific webhook payloads (identified by ID) with the latest configuration.
```bash
yarn hook:update --ids abc123,def456
```

### Update V3 webhooks
```bash
yarn hook:update:v3 --ids abc123,def456
```
Each update command automatically detects the webhook type from its `[Lobby] [ENV] ...` name, rebuilds the payload, and issues a versioned `PUT` request.

### Delete webhooks
Delete one, an environment slice, or every owned webhook.
```bash
# Single webhook
yarn delete:one   # (configure the ID inside package.json script)
node src/index.js delete --one abc123

# All hooks for a single environment value: [DEV], [STG], [PROD]
yarn delete:env:dev
node src/index.js delete --env [DEV]

# Every webhook owned by this tool
yarn delete:all
node src/index.js delete --all
```
See `docs/webhook-*-workflow.md` for deep dives into each command.

## Contributing
1. Fork the repository and create a feature branch.
   ```bash
   git checkout -b feature/my-feature
   ```
2. Install dependencies and make your changes.
3. Run the relevant commands (create/update/delete) against a sandbox Contentful environment.
4. Commit using conventional commit messages and open a Pull Request.

## License
Internal tooling – see Bally's organizational guidelines for usage.
