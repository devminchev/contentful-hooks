# Webhook Update Workflow

This document describes the workflow for updating webhooks in the contentful-hooks CLI tool.

## Overview

The update process follows a sequential, pattern that validates ownership and rebuilds webhooks using the latest repository configuration.

## Process Flow

```mermaid
flowchart TD
    A["`**User Input**
    --ids abc123,def456 (comma-separated)`"] --> B["`**Parse Webhook IDs**
    Split and trim whitespace`"]
    
    B --> C["`**Load Environment Settings**
    NODE_ENV + JURISDICTION from config.js`"]
    
    C --> D["`**Sequential Processing**
    Process each webhook ID in order`"]
    
    D --> E["`**Validate Webhook**
    Check existence and ownership`"]
    
    E --> F{"`**Valid & Owned?**`"}
    F -->|No| G["`**Log Error & Skip**
    Continue to next webhook`"]
    F -->|Yes| H["`**Identify Webhook Type**
    Extract type from webhook name`"]
    
    H --> I{"`**Type Identified?**`"}
    I -->|No| G
    I -->|Yes| J["`**Rebuild Payload**
    Use current environment config`"]
    
    J --> K["`**Update Webhook**
    PUT with optimistic locking`"]
    
    K --> L{"`**Update Success?**`"}
    L -->|No| M["`**Log Error**
    Continue to next webhook`"]
    L -->|Yes| N["`**Log Success**
    Continue to next webhook`"]
    
    G --> O{"`**More Webhooks?**`"}
    M --> O
    N --> O
    O -->|Yes| D
    O -->|No| P["`**Process Complete**
    All webhook IDs processed`"]
    
    style A fill:#e3f2fd
    style G fill:#ffebee
    style M fill:#ffebee
    style N fill:#e8f5e8
    style P fill:#e8f5e8
```

## API Communication Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI as CLI Tool
    participant Config as config.js
    participant Contentful as Contentful API
    
    User->>CLI: yarn hook:update --ids abc123,def456 (V2/V3)
    
    Note over CLI: Initialize
    CLI->>CLI: Parse webhook IDs
    CLI->>Config: getEnvSettings()
    Config-->>CLI: { environment, osHost, contentfulEnv, credentials }
    
    Note over CLI: Sequential Processing (Graceful Error Handling)
    
    loop For Each Webhook ID
        CLI->>Contentful: GET /webhook_definitions/{id}
        alt Webhook exists and owned
            Contentful-->>CLI: 200 OK + webhook data
            Note over CLI: Validate ownership, identify type, rebuild payload
            CLI->>Contentful: PUT /webhook_definitions/{id} (with version)
            alt Success
                Contentful-->>CLI: 200 OK
                CLI->>User: Successfully updated webhook
            else Error
                Contentful-->>CLI: 4xx/5xx Error
                CLI->>User: Failed to update webhook (continue)
            end
        else Invalid/Not owned
            Contentful-->>CLI: 404 or ownership check fails
            CLI->>User: Webhook error (continue)
        end
    end
    
    CLI->>User: Update process complete
```

## Key Features

### 🔍 Sequential Processing
- Each webhook ID is processed one by one
- No bulk operations - clean error handling per ID

### 🛡️ Multiple Validation Layers
1. **Existence Check**: Does webhook exist in Contentful?
2. **Ownership Check**: Do we own it? (`X-unique-own-identifier: lobby-openSearch`)
3. **Type Identification**: Can we identify the webhook type?
4. **Version Matching**: Does it match target version (V2/V3)?

### ⚙️ Environment-Driven Updates
- Uses repository config as single source of truth
- Fresh payload generation using current environment settings
- No parameter extraction from existing webhooks

### 🎯 Error Handling
- Graceful failures - errors don't stop the entire process
- Clear logging at each decision point
- Continues processing remaining IDs even if some fail

### 🔄 Optimistic Locking
- Uses `X-Contentful-Version` header for safe updates
- Prevents concurrent modification conflicts

## Usage Examples

```bash
# Update V2 webhooks
yarn hook:update --ids abc123,def456

# Update V3 webhooks
yarn hook:update:v3 --ids abc123,def456
```

## Environment Configuration

The update process relies on environment variables:

```bash
export NODE_ENV=dev
export JURISDICTION=eu
```

Configuration is loaded from `config.js` based on these environment variables.

## Error Scenarios

| Error Type | Action | Impact |
|------------|--------|---------|
| Webhook not found | Skip to next ID | Continue processing |
| Not owned by tool | Skip to next ID | Continue processing |
| Cannot identify type | Skip to next ID | Continue processing |
| Version mismatch | Skip to next ID | Continue processing |
| Update fails | Log error, continue | Continue processing |

## Success Criteria

A webhook is successfully updated when:
1. ✅ Webhook exists in Contentful
2. ✅ Tool owns the webhook
3. ✅ Webhook type is identified
4. ✅ Version matches target (V2/V3)
5. ✅ Payload is rebuilt successfully
6. ✅ API update call succeeds 
