# Webhook Delete Workflow

This document describes the workflow for deleting webhooks in the contentful-hooks CLI tool.

## Overview

The delete process follows a flexible pattern that supports three different deletion options: single webhook deletion, environment-based deletion, and complete cleanup of all owned webhooks.

## Deletion Modes

The delete functionality supports three modes, all following the same basic pattern:

```mermaid
flowchart TD
    A["`**User Input**
    Delete command with mode option`"] --> B{"`**Mode Selection**`"}
    
    B -->|--one abc123| C["`**Single Webhook**
    Target: Specific webhook ID`"]
    B -->|--env DEV| D["`**Environment**
    Target: All webhooks for environment`"]
    B -->|--all| E["`**All Owned**
    Target: All owned webhooks`"]
    
    C --> F["`**Apply Filter**
    Identify target webhooks`"]
    D --> F
    E --> F
    
    F --> G{"`**Target Webhooks Found?**`"}
    G -->|No| H["`**No Webhooks Found**
    Log message and exit`"]
    G -->|Yes| I["`**Sequential Processing**
    Process each webhook in order`"]
    
    I --> J["`**For Each Webhook**
    DELETE /webhook_definitions/{id}`"]
    
    J --> K{"`**Delete Success?**`"}
    K -->|No| L["`**Log Error**
    Continue to next webhook`"]
    K -->|Yes| M["`**Log Success**
    Continue to next webhook`"]
    
    L --> N{"`**More Webhooks?**`"}
    M --> N
    N -->|Yes| J
    N -->|No| O["`**Process Complete**
    All webhooks processed`"]
    
    H --> P["`**Deletion Complete**
    No action taken`"]
    O --> P
    
    style A fill:#e3f2fd
    style H fill:#fff3e0
    style L fill:#ffebee
    style M fill:#e8f5e8
    style O fill:#e8f5e8
    style P fill:#e8f5e8
```

### Mode Characteristics

| Mode | Flag | Target | Use Case |
|------|------|--------|----------|
| **Single** | `--one <id>` | Specific webhook ID | Targeted deletion |
| **Environment** | `--env [ENV]` | All webhooks for environment | Environment cleanup |
| **All Owned** | `--all` | All owned webhooks | Complete cleanup |

## API Communication Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI as CLI Tool
    participant CollectHooks as collectHooks
    participant Contentful as Contentful API
    
    User->>CLI: node src/index.js delete [options]
    
    Note over CLI: Validate Delete Options
    CLI->>CLI: Validate single option provided (--one, --env, or --all)
    alt No valid option
        CLI->>User: Exit with error message
    end
    
    Note over CLI: Get Owned Webhooks
    CLI->>CollectHooks: getOwnedWebhooks(client)
    CollectHooks->>Contentful: GET /webhook_definitions?limit=200
    Contentful-->>CollectHooks: Webhook definitions array
    CollectHooks->>CollectHooks: findOwn(hookPayload)
    Note over CollectHooks: Filter by X-unique-own-identifier: 'lobby-openSearch'
    CollectHooks-->>CLI: Owned webhooks array
    
    Note over CLI: Filter Target Webhooks
    CLI->>CLI: Apply deletion mode filter
    Note over CLI: Single ID, Environment, or All Owned
    
    alt No webhooks found
        CLI->>User: No webhooks found for deletion
    else Webhooks found for deletion
        CLI->>User: Found N webhooks for deletion
        
        Note over CLI: Sequential Deletion Loop
        
        loop For Each Target Webhook (1 to N webhooks)
            CLI->>CLI: deleteByID(client, webhook.id)
            CLI->>Contentful: DELETE /webhook_definitions/{id}
            alt Success
                Contentful-->>CLI: 200 OK
                CLI->>User: Successfully deleted webhook
            else Error
                Contentful-->>CLI: 4xx/5xx Error
                CLI->>User: Failed to delete webhook (continue with next)
            end
        end
        
        CLI->>User: Deletion process complete
    end
```

## Key Features

### 🔒 Ownership Validation
- Only deletes webhooks with `X-unique-own-identifier: 'lobby-openSearch'`
- Prevents accidental deletion of third-party webhooks
- Automatic filtering during webhook collection

### 🎯 Multiple Deletion Modes
- **Single ID**: Precise deletion for specific webhooks
- **Environment**: Bulk deletion for environment cleanup
- **All Owned**: Complete cleanup of all tool-created webhooks

### 🔄 Sequential Processing
- One webhook at a time for clear audit trails
- Individual error handling prevents cascading failures
- Continues processing even if individual deletions fail

### 📋 Comprehensive Logging
- Clear identification of webhooks being deleted
- Success/failure status for each operation
- Environment-specific filtering results

### 🛡️ Safety Features
- Ownership validation before any deletion
- Graceful handling of missing webhooks
- Non-destructive validation (no accidental deletions)

## Usage Examples

### Command Line Usage

```bash
# Delete a single webhook by ID
yarn delete:one
# or
node src/index.js delete --one abc123

# Delete all webhooks for DEV environment
yarn delete:env:dev
# or
node src/index.js delete --env "[DEV]"

# Delete all owned webhooks
yarn delete:all
# or
node src/index.js delete --all
```

### Package.json Scripts

```json
{
  "scripts": {
    "delete:one": "node src/index.js delete --one <webhook-id>",
    "delete:env:dev": "node src/index.js delete --env '[DEV]'",
    "delete:env:stg": "node src/index.js delete --env '[STG]'",
    "delete:env:prod": "node src/index.js delete --env '[PROD]'",
    "delete:all": "node src/index.js delete --all"
  }
}
```

## Environment Identifiers

The environment-based deletion uses these identifiers:

| Environment | Identifier | Description |
|-------------|-----------|-------------|
| Development | `[DEV]` | Development environment webhooks |
| Staging | `[STG]` | Staging environment webhooks |
| Production | `[PROD]` | Production environment webhooks |
