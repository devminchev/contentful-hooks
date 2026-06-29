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

## Commands

### `create`

Create all standard webhooks for the configured environment.

📋 **[Create workflow breakdown →](docs/webhook-create-workflow.md)**

```bash
yarn hook:create
```

*No additional options.*

---

### `create-v3`

Create webhooks specifically for the V3 implementation.

```bash
yarn hook:create:v3
```

*No additional options.*

---

### `update`

Update existing V2 webhooks by their IDs. The tool automatically identifies the webhook type from the webhook name and updates it with the latest payload configuration.

```bash
yarn hook:update --ids <webhookIds>
```

#### Options

* `--ids <webhookIds>`: Comma-separated list of webhook IDs to update. **Required**.

#### Examples

```bash
# Update a single V2 webhook
yarn hook:update --ids abc123

# Update multiple V2 webhooks
yarn hook:update --ids abc123,def456,ghi789

# alternatively, using node directly
node src/index.js update --ids abc123,def456
```

📋 **[Update workflow breakdown →](docs/webhook-update-workflow.md)**

---

### `update-v3`

Update existing V3 webhooks by their IDs. The tool automatically identifies the webhook type from the webhook name and updates it with the latest V3 payload configuration.

```bash
yarn hook:update:v3 --ids <webhookIds>
```

#### Options

* `--ids <webhookIds>`: Comma-separated list of webhook IDs to update. **Required**.

#### Examples

```bash
# Update a single V3 webhook
yarn hook:update:v3 --ids abc123

# Update multiple V3 webhooks
yarn hook:update:v3 --ids abc123,def456,ghi789

# alternatively, using node directly
node src/index.js update-v3 --ids abc123,def456
```

**Note**: The update commands automatically:
- Identify the webhook type from the webhook name
- Extract environment details from the existing webhook
- Rebuild the webhook using the latest payload configuration
- Maintain proper version control with optimistic locking


---

### `delete`

Delete existing webhooks. You must provide one of the following options:

* `--one <webhookId>`: Delete a single webhook by its ID.
* `--env <environment>`: Delete all webhooks in the given environment. Valid values are `[DEV]`, `[STG]`, or `[PROD]`.
* `--all`: Delete *all* owned webhooks.

#### Examples

```bash
# Delete a single webhook by ID
yarn delete:one // this requires to amend the webhook id in the package.json

# alternatively
node src/index.js delete --one abc123

# Delete all webhooks syncing to [DEV] OS
yarn delete:env:dev

# Delete every webhook you own
yarn delete:all
```

📋 **[Delete workflow breakdown →](docs/webhook-delete-workflow.md)**

---

## Global Options

* `-V, --version` Display the current version of the tool.
* `-h, --help` Show help information for a command.

---

## Environment & Configuration

Before running any commands, ensure you have set the following environment variables (or configured them in your `.env` file)

---

## Contributing

1. Fork the repo
2. Create a feature branch

   ```bash
   git checkout -b feature/my-feature
   ```
3. Commit your changes

   ```bash
   git commit -m "Add my feature"
   ```
4. Push to branch

   ```bash
   git push origin feature/my-feature
   ```
5. Open a Pull Request

---

## License
Internal tooling – see Bally's organizational guidelines for usage.
