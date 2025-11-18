export const PUBLISH_EVENT = "Entry.publish";
export const UNPUBLISH_EVENT = "Entry.unpublish"; // TODO: check
export const SAVE_EVENT = "Entry.save";
export const AUTO_SAVE_EVENT = "Entry.auto_save";
export const ARCHIVE_EVENT = "Entry.archive";

export const HOOK_UNIQUE_ID = "lobby-openSearch";

export const sharedEnvFilter = (contentfulEnv) => ({
    equals: [
        {doc: "sys.environment.sys.id"},
        contentfulEnv
    ]
});

export const crateSharedHeaders = (base64Credentials) => {
    const headers = [
        {
            "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0",
            "key": "User-Agent"
        },
        {
            "key": "Authorization",
            "value": `Basic ${base64Credentials}`,
            "secret": true
        },
        {
            "key": "X-Query-Metadata",
            "value": `type: {/payload/sys/type}, contentType: {/payload/sys/contentType/sys/id}`
        }
    ];

    return headers;
}

export const setConflictRefreshBehaviour = (nodeEnv ) => {
    const env = nodeEnv.toLowerCase();

    // const retryBehaviour = `retry_on_conflict=1`;
    const refreshWait = `refresh=wait_for`;
    const refreshImmediate = `refresh=true`

    switch (env) {
        case "dev": 
            return `${refreshWait}`;
        case "stg":
            return `${refreshWait}`;
        case "prod":
            return `${refreshImmediate}`;
        default:
            return `${refreshWait}`;
    }
}

export const PROD_PUBLISH_HOOK_TOPIC = { topics: [PUBLISH_EVENT] };
export const PROD_UNPUBLISH_HOOK_TOPIC = { topics: [UNPUBLISH_EVENT] };

export const STG_PUT_HOOK_TOPICS = { topics: [SAVE_EVENT, AUTO_SAVE_EVENT, PUBLISH_EVENT] }
export const DEV_PUT_HOOK_TOPICS = { topics: [SAVE_EVENT, AUTO_SAVE_EVENT, PUBLISH_EVENT] }

export const STG_DELETE_HOOK_TOPICS = { topics: [ARCHIVE_EVENT, UNPUBLISH_EVENT] }
export const DEV_DELETE_HOOK_TOPICS = { topics: [ARCHIVE_EVENT, UNPUBLISH_EVENT] }

/* ------------ Handle archive game titles ------------------ */
// When to put games in the archive index
export const PROD_PUT_ARCHIVED_GAMES_TOPIC = {topics: [ARCHIVE_EVENT]};
export const STG_PUT_ARCHIVED_GAMES_TOPIC = {topics: [ARCHIVE_EVENT]};
export const DEV_PUT_ARCHIVED_GAMES_TOPIC = {topics: [ARCHIVE_EVENT]};
// When to remove games from the archive index
export const PROD_DELETE_ARCHIVED_GAMES_TOPIC = {topics: [PUBLISH_EVENT]};
export const STG_DELETE_ARCHIVED_GAMES_TOPIC = {topics: [PUBLISH_EVENT]};
export const DEV_DELETE_ARCHIVED_GAMES_TOPIC = {topics: [PUBLISH_EVENT]};

