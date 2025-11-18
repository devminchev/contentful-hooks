# contentful-hooks

A CLI tool for managing the iGaming Lobby Contentful webhooks.

## Installation

```bash
# Clone the repo
git clone https://gitlab.ballys.tech/excite/native/tools/contentful-hooks.git

# Move into the project directory
cd contentful-hooks

# Install dependencies
yarn
```

## Usage

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
