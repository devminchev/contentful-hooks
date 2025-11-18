import { IG_GAMES_V2_WRITE_ALIAS } from "../common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from '../common/shared.js';
import { pickHookTopic, createHookName } from '../../utils.js';
import { WEBHOOK_SUFFIXES } from '../../constants/webhookTextParts.js';
import { SITE_GAME_V2_MODEL } from '../common/contentfulModels.js';

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
        sash: "{/payload/fields/sash}",
        tags: "{/payload/fields/tags}",
        maxBet: "{/payload/fields/maxBet}",
        minBet: "{/payload/fields/minBet}",
        venture: "{/payload/fields/venture}",
        headlessJackpot: "{/payload/fields/headlessJackpot}",
        gameId: "{/payload/fields/game/en-GB/sys/id}",
        createdAt: "{/payload/sys/createdAt}",
        updatedAt: "{/payload/sys/updatedAt}",
        showNetPosition: "{/payload/fields/showNetPosition}",
        platformVisibility: "{/payload/fields/platformVisibility}",
        environmentVisibility: "{/payload/fields/environmentVisibility}",
        liveHidden: "{/payload/fields/liveHidden}",
        
    }
};
export const createSiteGameV2HookUrl = (osHost, nodeEnv='dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);
    
    return (`${osHost}${IG_GAMES_V2_WRITE_ALIAS}/_doc/{/payload/sys/id}?routing={/payload/fields/game/en-GB/sys/id}&${retryRefresh}`);
}

export const createSiteGameV2HookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.siteGamesV3);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        equals: [
            {doc: "sys.contentType.sys.id"},
            SITE_GAME_V2_MODEL
        ]
    }
]);

export const siteGamesHookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createSiteGameV2HookName(nodeEnv), 
    hookUrl: createSiteGameV2HookUrl(host, nodeEnv), 
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv), 
    active: true,
    payload: SITE_GAME_V2_HOOK_CUSTOM_PAYLOAD
});
