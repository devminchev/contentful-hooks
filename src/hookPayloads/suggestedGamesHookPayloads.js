import { RECOMMENDED_GAMES_V2_INDEX_WRITE_ALIAS } from "./common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from './common/shared.js';
import { SUGGESTED_GAMES_MODEL } from './common/contentfulModels.js';
import { pickHookTopic, createHookName } from '../utils.js';
import { WEBHOOK_SUFFIXES } from '../constants/webhookTextParts.js';

const CONTENTFUL_SUGGESTED_GAMES_MODEL_MODEL_REGEXP = `^(${SUGGESTED_GAMES_MODEL})$`;

export const RECOMMENDED_GAMES_V2_HOOK_CUSTOM_PAYLOAD = {
    id: "{/payload/sys/id}",
    contentType: "{/payload/sys/contentType/sys/id}",
    entryTitle: "{/payload/fields/entryTitle}",
    venture: "{/payload/fields/venture}",
    games: "{/payload/fields/games}",
    environment: "{/payload/fields/environment/en-GB}",
    cmsEnv: "{/payload/sys/environment/sys/id}",
    updatedAt: "{/payload/sys/updatedAt}",
};
export const createSuggestedGamesHookUrl = (osHost, nodeEnv='dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${RECOMMENDED_GAMES_V2_INDEX_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createSuggestedGamesHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.suggestedGames);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            {doc: "sys.contentType.sys.id"},
            {pattern: CONTENTFUL_SUGGESTED_GAMES_MODEL_MODEL_REGEXP}
        ]
    }
]);

export const suggestedGamesHookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createSuggestedGamesHookName(nodeEnv), 
    hookUrl: createSuggestedGamesHookUrl(host, nodeEnv), 
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv), 
    active: true,
    payload: RECOMMENDED_GAMES_V2_HOOK_CUSTOM_PAYLOAD
});
