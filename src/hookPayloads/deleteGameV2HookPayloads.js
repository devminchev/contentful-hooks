
import { GAMES_INDEX_WRITE_ALIAS, IG_GAMES_V2_WRITE_ALIAS } from './common/osIndexes.js';
import { sharedEnvFilter } from './common/shared.js';
import { pickHookTopic, createHookName } from '../utils.js';
import { WEBHOOK_SUFFIXES } from '../constants/webhookTextParts.js';
import {
    GAME_V2_MODEL
} from './common/contentfulModels.js';

// This hook is shared between V2 and V3 api
export const DELETE_GAMES_V2_HOOK_CUSTOM_PAYLOAD = {
    query: {
        bool: {
            should: [
                {
                    bool: {
                        must: [
                            {
                                match: {
                                    "game.id": "{/payload/sys/id}"
                                }
                            }
                        ]
                    }
                },
                {
                    bool: {
                        must: [
                            {
                                match: {
                                    "siteGame.gameId": "{/payload/sys/id}"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
};
export const createDeleteV2HookUrl = (osHost, version) => {
    const osIndex = version === 'v3' ? IG_GAMES_V2_WRITE_ALIAS : GAMES_INDEX_WRITE_ALIAS
    return `${osHost}${osIndex}/_delete_by_query?refresh=true`;
};

export const createDeleteV2HookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.gameV2Delete);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        equals: [
            { doc: "sys.contentType.sys.id" },
            GAME_V2_MODEL
        ]
    }
]);

export const deleteGameV2HookBodyParams = (nodeEnv, host, contentfulEnv, version = 'v2') => ({
    hookName: createDeleteV2HookName(nodeEnv),
    hookUrl: createDeleteV2HookUrl(host, version),
    ...pickHookTopic(nodeEnv, 'delete'), 
    filters: createFilters(contentfulEnv),
    active: true,
    payload: DELETE_GAMES_V2_HOOK_CUSTOM_PAYLOAD
});
