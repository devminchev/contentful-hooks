import { updateWebhook } from './webhooksHttpReq.js';
import { hookBuilder } from './webhookMethods.js';
import { extractSuffixFromWebhookName, identifyWebhookTypeBySuffix } from '../constants/webhookTextParts.js';

// Import all V2 payload functions
import { gameV2hookBodyParams } from '../hookPayloads/gameV2HookPayloads.js';
import { siteGameV2hookBodyParams } from '../hookPayloads/siteGameV2HookPayloads.js';
import { sectionsHookBodyParams } from '../hookPayloads/sectionsHookPayloads.js';
import { personalisedSectionsHookBodyParams } from '../hookPayloads/personalisationSectionsHookPayloads.js';
import { suggestedGamesHookBodyParams } from '../hookPayloads/suggestedGamesHookPayloads.js';
import { layoutsHookBodyParams } from '../hookPayloads/layoutsHookPayloads.js';
import { venturesHookBodyParams } from '../hookPayloads/venturesHookPayloads.js';
import { categoriesHookBodyParams } from '../hookPayloads/categoriesHookPayloads.js';

// Import all V3 payload functions
import { navigationHookBodyParams } from '../hookPayloads/V3HookPayloads/navigationHookPayloads.js';
import { viewHookBodyParams } from '../hookPayloads/V3HookPayloads/viewHookPayloads.js';
import { gameSectionsBodyParams } from '../hookPayloads/V3HookPayloads/gameSectionsHookPayloads.js';
import { marketingSectionsHookBodyParams } from '../hookPayloads/V3HookPayloads/marketingSectionsHookPayloads.js';
import { mlSectionsBodyParams } from '../hookPayloads/V3HookPayloads/mlSectionsHookPayloads.js';
import { mlDefaultsHookBodyParams } from '../hookPayloads/V3HookPayloads/mlDefaultsHookPayloads.js';
import { gamesHookBodyParams } from '../hookPayloads/V3HookPayloads/gamesHookPayloads.js';
import { siteGamesHookBodyParams } from '../hookPayloads/V3HookPayloads/siteGamesHookPayloads.js';
import { themesHookBodyParams } from '../hookPayloads/V3HookPayloads/themesHookPayloads.js';

// Import delete payloads
import { deleteGeneralHookBodyParams } from '../hookPayloads/deleteGeneralHookPayloads.js';
import { deleteGameV2HookBodyParams } from '../hookPayloads/deleteGameV2HookPayloads.js';
import { deleteArchivedGamesHookBodyParams } from '../hookPayloads/deleteFromArchivedGamesPayload.js';

const OWNED_WEBHOOK_IDENTIFIER = 'lobby-openSearch';

// Webhook type mapping based on name patterns
const WEBHOOK_TYPE_MAPPING = {
    // V2 webhooks
    'gameV2': { payloadFunction: gameV2hookBodyParams, version: 'v2' },
    'siteGameV2': { payloadFunction: siteGameV2hookBodyParams, version: 'v2' },
    'sections': { payloadFunction: sectionsHookBodyParams, version: 'v2' },
    'personalisedSections': { payloadFunction: personalisedSectionsHookBodyParams, version: 'v2' },
    'suggestedGames': { payloadFunction: suggestedGamesHookBodyParams, version: 'v2' },
    'layouts': { payloadFunction: layoutsHookBodyParams, version: 'v2' },
    'venturesV2': { payloadFunction: venturesHookBodyParams, version: 'v2' },
    'categories': { payloadFunction: categoriesHookBodyParams, version: 'v2' },
    
    // V3 webhooks
    'navigation': { payloadFunction: navigationHookBodyParams, version: 'v3' },
    'view': { payloadFunction: viewHookBodyParams, version: 'v3' },
    'gameSections': { payloadFunction: gameSectionsBodyParams, version: 'v3' },
    'marketingSections': { payloadFunction: marketingSectionsHookBodyParams, version: 'v3' },
    'mlSections': { payloadFunction: mlSectionsBodyParams, version: 'v3' },
    'mlDefaults': { payloadFunction: mlDefaultsHookBodyParams, version: 'v3' },
    'gamesV3': { payloadFunction: gamesHookBodyParams, version: 'v3' },
    'siteGamesV3': { payloadFunction: siteGamesHookBodyParams, version: 'v3' },
    'themes': { payloadFunction: themesHookBodyParams, version: 'v3' },
    'venturesV3': { payloadFunction: venturesHookBodyParams, version: 'v3' },
    
    // Delete webhooks
    'generalDelete': { payloadFunction: deleteGeneralHookBodyParams, version: 'v2' },
    'gameV2Delete': { payloadFunction: deleteGameV2HookBodyParams, version: 'v2' },
    'generalDeleteV3': { payloadFunction: deleteGeneralHookBodyParams, version: 'v3' },
    'gameV2DeleteV3': { payloadFunction: deleteGameV2HookBodyParams, version: 'v3' },
    'archivedGamesDelete': { payloadFunction: deleteArchivedGamesHookBodyParams, version: 'v3' },
};

export const updateWebhooks = async (client, options, envSettings) => {
    const { ids } = options;
    
    if (!ids || ids.length === 0) {
        console.log('No webhook IDs provided for update.');
        return;
    }

    const webhookIds = ids.split(',').map(id => id.trim());
    
    console.log(`Attempting to update ${webhookIds.length} V2 webhooks...`);
    
    for (const webhookId of webhookIds) {
        try {
            await updateWebhookById(client, webhookId, 'v2', envSettings);
        } catch (error) {
            console.error(`Failed to update webhook ${webhookId}:`, error.message);
        }
    }
};

export const updateV3Webhooks = async (client, options, envSettings) => {
    const { ids } = options;
    
    if (!ids || ids.length === 0) {
        console.log('No webhook IDs provided for update.');
        return;
    }

    const webhookIds = ids.split(',').map(id => id.trim());
    
    console.log(`Attempting to update ${webhookIds.length} V3 webhooks...`);
    
    for (const webhookId of webhookIds) {
        try {
            await updateWebhookById(client, webhookId, 'v3', envSettings);
        } catch (error) {
            console.error(`Failed to update webhook ${webhookId}:`, error.message);
        }
    }
};

export const updateWebhookById = async (client, webhookId, targetVersion = 'v2', envSettings = null) => {
    try {

        const currentWebhook = await getWebhookById(client, webhookId);
        
        if (!currentWebhook) {
            console.error(`Webhook with ID ${webhookId} not found.`);
            return;
        }


        const isOwned = checkWebhookOwnership(currentWebhook);
        
        if (!isOwned) {
            console.error(`Webhook with ID ${webhookId} is not owned by this tool. Skipping.`);
            return;
        }

        console.log(`Found owned webhook: ${currentWebhook.name}`);
        console.log(`Current webhook version: ${currentWebhook.sys.version}`);
        console.log(`Webhook "${currentWebhook.name}" is ready for update.`);
        
        const updatedPayload = await applyUpdateLogic(currentWebhook, targetVersion, envSettings);
        
        if (updatedPayload) {
            const response = await updateWebhook(client, webhookId, updatedPayload, currentWebhook.sys.version);
            console.log(`Successfully updated webhook with ID: ${webhookId}`);
            return response;
        } else {
            console.log(`No updates applied to webhook ${webhookId}. Webhook type not recognized or not matching target version.`);
        }
        
    } catch (error) {
        console.error(`Failed to update webhook with ID ${webhookId}:`, error.message);
        throw error;
    }
};


const checkWebhookOwnership = (webhook) => {
    if (!webhook.headers || !Array.isArray(webhook.headers)) {
        return false;
    }
    
    const ownedHeaders = webhook.headers.filter(header => 
        header.key === 'X-unique-own-identifier' && header.value === OWNED_WEBHOOK_IDENTIFIER
    );
    
    return ownedHeaders.length > 0;
};


const applyUpdateLogic = async (webhook, targetVersion, envSettings) => {
    console.log(`Applying update logic to webhook: ${webhook.name}`);
    
    
    const suffix = extractSuffixFromWebhookName(webhook.name);
    
    if (!suffix) {
        console.error(`Could not extract suffix from webhook name: ${webhook.name}`);
        return null;
    }
    
    
    const webhookType = identifyWebhookTypeBySuffix(suffix, targetVersion);
    
    if (!webhookType) {
        console.error(`Could not identify webhook type from suffix: ${suffix}`);
        return null;
    }

    const typeConfig = WEBHOOK_TYPE_MAPPING[webhookType];
    
    if (!typeConfig) {
        console.error(`No configuration found for webhook type: ${webhookType}`);
        return null;
    }


    if (typeConfig.version !== targetVersion) {
        console.log(`Webhook ${webhook.name} is version ${typeConfig.version}, but target version is ${targetVersion}. Skipping.`);
        return null;
    }

    console.log(`Identified webhook type: ${webhookType} (${typeConfig.version})`);
    

    if (!envSettings) {
        console.error('Environment settings not provided for update operation');
        return null;
    }

    const { environment, osHost, contentfulEnv, credentials } = envSettings;
    

    try {
        let hookBodyParams;
        
        if (webhookType === 'venturesV2' || webhookType === 'venturesV3') {
            
            const version = typeConfig.version;
            hookBodyParams = typeConfig.payloadFunction(environment.toUpperCase(), osHost, contentfulEnv, version);
        } else if (webhookType.includes('Delete')) {
            
            const version = typeConfig.version === 'v3' ? 'v3' : 'v2';
            hookBodyParams = typeConfig.payloadFunction(environment.toUpperCase(), osHost, contentfulEnv, version);
        } else {
            hookBodyParams = typeConfig.payloadFunction(environment.toUpperCase(), osHost, contentfulEnv);
        }

        
        const operation = webhook.name.toLowerCase().includes('delete') ? 'delete' : 'create';
        const method = operation === 'delete' ? 'POST' : 'PUT';
        const updatedWebhook = hookBuilder(hookBodyParams, environment, credentials, method, operation);
        
        console.log(`Successfully rebuilt webhook payload for ${webhookType}`);
        return updatedWebhook;
        
    } catch (error) {
        console.error(`Failed to rebuild webhook payload for ${webhookType}:`, error.message);
        return null;
    }
};

export const getWebhookById = async (client, webhookId) => {
    try {
        const response = await client.get(`/webhook_definitions/${webhookId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch webhook with ID ${webhookId}:`, error.message);
        return null;
    }
};
