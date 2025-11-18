import { gameHook, 
    categoriesHook, 
    sectionsHook, 
    layoutsHook, 
    venturesHook, 
    siteGameHook, 
    personalisedSectionsHook, 
    suggestedGamesHook, 
    // V3 imports
    navigationHook,
    viewHook,
    gameSectionsHook,
    marketingSectionsHook,
    mlSectionsHook,
    mlDefaultsHook,
    gamesHook,
    siteGamesHook,
    themesHook
} from './publishHooks.js';
import { validateParams, operationLogger, generateIdempotencyKey, generateUniqueIdKeys } from '../utils.js';
import { generalDeleteHook, gameV2DeleteHook, generalDeleteHookV3, gameV2DeleteHookV3 } from './deleteHooks.js';
import { crateSharedHeaders } from '../hookPayloads/common/shared.js'

const hookHeaderBuilder = (credentials, hookBody, nodeEnv = 'DEV') => {
    let headers = crateSharedHeaders(credentials);

    // Generate the unique SHA256 hash
    const idempotencyKey = generateIdempotencyKey(hookBody);
    const uniqueIdKeys = generateUniqueIdKeys(nodeEnv.toUpperCase());

    // Adding the custom header
    headers.push({
        key: 'X-Contentful-Idempotency-Key',
        value: idempotencyKey
    });
    headers.push(...uniqueIdKeys);

    return headers;

};

export const hookBuilder = (hookBodyParams, nodeEnv, credentials, method, operation = 'create') => {
    const { hookName, hookUrl, topics, filters, payload } = hookBodyParams;

    validateParams(hookBodyParams);

    let body = {};

    switch (operation) {
        case 'create': (body = payload); break;
        case 'delete': (body = { ...payload }); break;
        default: break;
    }

    const hookBody = {
        name: hookName,
        url: hookUrl,
        topics,
        filters,
        "transformation": {
            includeContentLength: true,
            method,
            contentType: "application/json",
            body
        },
    };

    const headers = hookHeaderBuilder(credentials, hookBody, nodeEnv) || {};

    const returnObj = {
        ...hookBody,
        headers: headers
    }

    return returnObj;
};

export const createWebhooksOnEnv = async (envSettings) => {
    operationLogger('Ventures');
    await venturesHook(envSettings);

    operationLogger('Categories');
    await categoriesHook(envSettings);

    operationLogger('Sections');
    await sectionsHook(envSettings);

    operationLogger('Personalised Sections');
    await personalisedSectionsHook(envSettings);

    operationLogger('Layouts');
    await layoutsHook(envSettings);

    operationLogger('Games V2');
    await gameHook(envSettings);

    operationLogger('SiteGames V2');
    await siteGameHook(envSettings);

    operationLogger('Suggested Games');
    await suggestedGamesHook(envSettings);

    operationLogger('General Delete');
    await generalDeleteHook(envSettings);

    operationLogger('Game V2 Delete');
    await gameV2DeleteHook(envSettings);

    // Not needed currently
    // operationLogger('Archive index Game and SiteGames Delete');
    // await archiveIndexDeleteHook(envSettings);
}

export const createV3WebhooksOnEnv = async (envSettings) => {
    operationLogger('Ventures V3'); 
    await venturesHook(envSettings, 'v3');

    operationLogger('Navigation');
    await navigationHook(envSettings);

    operationLogger('View');
    await viewHook(envSettings);

    operationLogger('GameSections');
    await gameSectionsHook(envSettings);

    operationLogger('MarketingSections');
    await marketingSectionsHook(envSettings);

    operationLogger('MLSections');
    await mlSectionsHook(envSettings);

    operationLogger('MLDefaults');
    await mlDefaultsHook(envSettings);
    
    operationLogger('Games V2 for V3 API');
    await gamesHook(envSettings);

    operationLogger('Site Games V2 for V3 API');
    await siteGamesHook(envSettings)

    operationLogger('Themes');
    await themesHook(envSettings);

    operationLogger('General Delete V3');
    await generalDeleteHookV3(envSettings);

    operationLogger('Game V2 Delete V3');
    await gameV2DeleteHookV3(envSettings);
}
