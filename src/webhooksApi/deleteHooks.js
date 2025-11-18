import { hookBuilder } from './webhookMethods.js';
import { createWebhook } from './webhooksHttpReq.js';
import { deleteGeneralHookBodyParams } from '../hookPayloads/deleteGeneralHookPayloads.js';
import { deleteGameV2HookBodyParams } from '../hookPayloads/deleteGameV2HookPayloads.js';
import { deleteArchivedGamesHookBodyParams } from '../hookPayloads/deleteFromArchivedGamesPayload.js';

const OPERATION = 'delete';

export const generalDeleteHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(deleteGeneralHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "POST", OPERATION);
    await createWebhook(client, payload);
}

export const gameV2DeleteHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(deleteGameV2HookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "POST", OPERATION);
    await createWebhook(client, payload);
}

export const archiveIndexDeleteHook = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(deleteArchivedGamesHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv), environment, credentials, "POST", OPERATION);
    await createWebhook(client, payload);
}

// V3
export const generalDeleteHookV3 = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(deleteGeneralHookBodyParams(environment.toUpperCase(), osHost, contentfulEnv, 'v3'), environment, credentials, "POST", OPERATION);
    await createWebhook(client, payload);
}

export const gameV2DeleteHookV3 = async ({environment, osHost, contentfulEnv, credentials, client}) => {
    const payload = hookBuilder(deleteGameV2HookBodyParams(environment.toUpperCase(), osHost, contentfulEnv, 'v3'), environment, credentials, "POST", OPERATION);
    await createWebhook(client, payload);
}
