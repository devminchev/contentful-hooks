import { createHash } from "crypto";
import { DEV_PUT_HOOK_TOPICS,
    DEV_DELETE_HOOK_TOPICS, 
    STG_PUT_HOOK_TOPICS, 
    STG_DELETE_HOOK_TOPICS, 
    PROD_PUBLISH_HOOK_TOPIC, 
    PROD_UNPUBLISH_HOOK_TOPIC,
    HOOK_UNIQUE_ID,
    DEV_PUT_ARCHIVED_GAMES_TOPIC,
    DEV_DELETE_ARCHIVED_GAMES_TOPIC,
    STG_PUT_ARCHIVED_GAMES_TOPIC,
    STG_DELETE_ARCHIVED_GAMES_TOPIC,
    PROD_PUT_ARCHIVED_GAMES_TOPIC,
    PROD_DELETE_ARCHIVED_GAMES_TOPIC
} from "./hookPayloads/common/shared.js";

export const validateParams = (params) => {
    const missingParams = Object.keys(params).filter(key => params[key] === undefined);

    if (missingParams.length > 0) {
        throw new Error(`Missing mandatory parameters: ${missingParams.join(', ')}.`);
    }
}

export const encodeBase64Creds = (osUser, osPass) => Buffer.from(`${osUser}:${osPass}`).toString('base64');

export const validateConfig = (currentConfig) => {
    const requiredFields = ['OS_HOST', 'CONTENTFUL_ENV', 'OS_USER', 'OS_PASS', 'CONTENTFUL_API_TOKEN', 'CONTENTFUL_SPACE'];
    const missingFields = requiredFields.filter(field => !currentConfig[field]);
    if (missingFields.length > 0) {
        throw new Error(`Missing configuration for: ${missingFields.join(', ')}`);
    }
    console.log(`Current host: ${currentConfig.OS_HOST}, Contentful environment is: ${currentConfig.CONTENTFUL_ENV}`);
};

export const operationLogger = (hookName) => {
    console.log(`Creating ${hookName} webhook......`)
}

export const generateIdempotencyKey = (data) => {
    return createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

export const generateUniqueIdKeys = (nodeEnv) => {
    return [
        {
            "key": "X-unique-own-identifier",
            "value": HOOK_UNIQUE_ID
        },
        {
            "key": "X-unique-own-deployment-env",
            "value": `[${nodeEnv}]`
        }
    ]
};

// Separate topic picker for archiving games, as the logic on what events are listened to is opposite.
export const pickHookTopicForArchivedGames = (nodeEnv, operation = 'archive-remove') => {
    // Helper function to select topic based on operation
    const selectTopic = (createTopic, deleteTopic) => {
        return operation === 'archive-remove' ? deleteTopic : createTopic;
    };

    const env = nodeEnv.toLowerCase();

    switch (env) {
        case "dev":
            return selectTopic(DEV_PUT_ARCHIVED_GAMES_TOPIC, DEV_DELETE_ARCHIVED_GAMES_TOPIC);
        case "stg":
            return selectTopic(STG_PUT_ARCHIVED_GAMES_TOPIC, STG_DELETE_ARCHIVED_GAMES_TOPIC);
        case "prod":
            return selectTopic(PROD_PUT_ARCHIVED_GAMES_TOPIC, PROD_DELETE_ARCHIVED_GAMES_TOPIC);
        default:
            return selectTopic(DEV_PUT_ARCHIVED_GAMES_TOPIC, DEV_DELETE_ARCHIVED_GAMES_TOPIC);
    }
}


export const pickHookTopic = (nodeEnv, operation = 'create') => {
    // Helper function to select topic based on operation
    const selectTopic = (createTopic, deleteTopic) => {
        return operation === 'delete' ? deleteTopic : createTopic;
    };

    const env = nodeEnv.toLowerCase();

    switch (env) {
        case "dev":
            return selectTopic(DEV_PUT_HOOK_TOPICS, DEV_DELETE_HOOK_TOPICS);
        case "stg":
            return selectTopic(STG_PUT_HOOK_TOPICS, STG_DELETE_HOOK_TOPICS);
        case "prod":
            return selectTopic(PROD_PUBLISH_HOOK_TOPIC, PROD_UNPUBLISH_HOOK_TOPIC);
        default:
            return selectTopic(DEV_PUT_HOOK_TOPICS, DEV_DELETE_HOOK_TOPICS);
    }
}

export const createHookName = (nodeEnv, suffix, version = null) => {
    const versionSuffix = version ? ` ${version.toUpperCase()}` : '';
    return `[Lobby] [${nodeEnv}] ${suffix}${versionSuffix}`;
};


