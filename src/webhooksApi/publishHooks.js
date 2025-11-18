import { hookBuilder } from './webhookMethods.js';
import { createWebhook } from './webhooksHttpReq.js';
import { gameV2hookBodyParams  } from '../hookPayloads/gameV2HookPayloads.js';
import { siteGameV2hookBodyParams } from '../hookPayloads/siteGameV2HookPayloads.js';
import { sectionsHookBodyParams } from '../hookPayloads/sectionsHookPayloads.js';
import { personalisedSectionsHookBodyParams } from '../hookPayloads/personalisationSectionsHookPayloads.js';
import { suggestedGamesHookBodyParams  } from '../hookPayloads/suggestedGamesHookPayloads.js';
import { layoutsHookBodyParams  } from '../hookPayloads/layoutsHookPayloads.js';
import { venturesHookBodyParams  } from '../hookPayloads/venturesHookPayloads.js';
import { categoriesHookBodyParams  } from '../hookPayloads/categoriesHookPayloads.js';
// V3 imports
import { navigationHookBodyParams  } from '../hookPayloads/V3HookPayloads/navigationHookPayloads.js';
import { viewHookBodyParams } from '../hookPayloads/V3HookPayloads/viewHookPayloads.js';
import { gameSectionsBodyParams } from '../hookPayloads/V3HookPayloads/gameSectionsHookPayloads.js';
import { marketingSectionsHookBodyParams } from '../hookPayloads/V3HookPayloads/marketingSectionsHookPayloads.js';
import { mlSectionsBodyParams } from '../hookPayloads/V3HookPayloads/mlSectionsHookPayloads.js';
import { mlDefaultsHookBodyParams } from '../hookPayloads/V3HookPayloads/mlDefaultsHookPayloads.js';
import { gamesHookBodyParams } from '../hookPayloads/V3HookPayloads/gamesHookPayloads.js';
import { siteGamesHookBodyParams } from '../hookPayloads/V3HookPayloads/siteGamesHookPayloads.js';
import { themesHookBodyParams } from '../hookPayloads/V3HookPayloads/themesHookPayloads.js';

export const venturesHook = async ({environment, osHost, contentfulEnv, credentials, client}, version) => {
    const payload = hookBuilder(venturesHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv, version), environment, credentials, "PUT");
    await createWebhook(client, payload);
}

// V2 webhooks (current EU)
export const gameHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(gameV2hookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
}

export const siteGameHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(siteGameV2hookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
}

export const sectionsHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(sectionsHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
}

export const personalisedSectionsHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(personalisedSectionsHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
}

export const suggestedGamesHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(suggestedGamesHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
}

export const layoutsHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(layoutsHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
}

export const categoriesHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(categoriesHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT"); // env
    await createWebhook(client, payload);
}

// V3 webhooks
export const navigationHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(navigationHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
}

export const viewHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(viewHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
}

export const gameSectionsHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(gameSectionsBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
};
export const marketingSectionsHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(marketingSectionsHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
};
export const mlSectionsHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(mlSectionsBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
};
export const mlDefaultsHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(mlDefaultsHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
};
export const gamesHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(gamesHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
};

export const siteGamesHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(siteGamesHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
};

export const themesHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(themesHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "PUT");
    await createWebhook(client, payload);
};
