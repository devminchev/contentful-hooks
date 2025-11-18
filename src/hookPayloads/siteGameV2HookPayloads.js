import { GAMES_INDEX_WRITE_ALIAS } from "./common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from './common/shared.js';
import { pickHookTopic, createHookName } from '../utils.js';
import { WEBHOOK_SUFFIXES } from '../constants/webhookTextParts.js';

const CONTENTFUL_SITE_GAME_MODEL_NAME = 'siteGameV2';

export const SITE_GAME_V2_HOOK_CUSTOM_PAYLOAD = {
    game_to_sitegame: {
        name: "sitegame",
        parent: "{/payload/fields/game/en-GB/sys/id}"
    },
    siteGame: {
        id: "{/payload/sys/id}",
        contentType: "{/payload/sys/contentType/sys/id}",
        entryTitle: "{/payload/fields/entryTitle}",
        howToPlayContent: "{/payload/fields/howToPlayContent}",
        chat: "{/payload/fields/chat}",
        cmsEnv: "{/payload/sys/environment/sys/id}",
        environment: "{/payload/fields/environment/en-GB}",
        sash: "{/payload/fields/sash}",
        maxBet: "{/payload/fields/maxBet}",
        minBet: "{/payload/fields/minBet}",
        venture: "{/payload/fields/venture}",
        headlessJackpot: "{/payload/fields/headlessJackpot}",
        gameId: "{/payload/fields/game/en-GB/sys/id}",
        createdAt: "{/payload/sys/createdAt}",
        updatedAt: "{/payload/sys/updatedAt}"
    }
};
export const createSiteGameV2HookUrl = (osHost, nodeEnv='dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);
    
    return (`${osHost}${GAMES_INDEX_WRITE_ALIAS}/_doc/{/payload/sys/id}?routing={/payload/fields/game/en-GB/sys/id}&${retryRefresh}`);
}

export const createSiteGameV2HookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.siteGameV2);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        equals: [
            {doc: "sys.contentType.sys.id"},
            CONTENTFUL_SITE_GAME_MODEL_NAME
        ]
    }
]);

export const siteGameV2hookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createSiteGameV2HookName(nodeEnv), 
    hookUrl: createSiteGameV2HookUrl(host, nodeEnv), 
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv), 
    active: true,
    payload: SITE_GAME_V2_HOOK_CUSTOM_PAYLOAD
});
